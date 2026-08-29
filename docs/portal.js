import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app-check.js";

const config = window.NEUROFILES_SITE_CONFIG || {};
const portalConfig = config.firebasePortal || {};
const firebaseConfig = config.firebaseConfig || null;
const portalUrl = new URL(String(config.portalUrl || "app.html"), window.location.href).toString();
const profilesCollection = String(portalConfig.profilesCollection || "portalProfiles");
const workspacesCollection = String(portalConfig.workspacesCollection || "portalWorkspaces");
const subscriptionsCollection = String(portalConfig.subscriptionsCollection || "portalSubscriptions");
const eventsCollection = String(portalConfig.eventsCollection || "portalEvents");
const storageKey = "neurofiles-portal-email";

const elements = {
  authForm: document.getElementById("authForm"),
  authEmail: document.getElementById("authEmail"),
  authSubmit: document.getElementById("authSubmit"),
  authFeedback: document.getElementById("authFeedback"),
  authStatusTitle: document.getElementById("authStatusTitle"),
  authStatusText: document.getElementById("authStatusText"),
  authStateBadge: document.getElementById("authStateBadge"),
  signOutButton: document.getElementById("signOutButton"),
  workspaceName: document.getElementById("workspaceName"),
  workspacePlan: document.getElementById("workspacePlan"),
  workspaceStatus: document.getElementById("workspaceStatus"),
  portalVersion: document.getElementById("portalVersion"),
  profileDisplayName: document.getElementById("profileDisplayName"),
  profileEmail: document.getElementById("profileEmail"),
  planDisplay: document.getElementById("planDisplay"),
  billingStatusDisplay: document.getElementById("billingStatusDisplay"),
  billingPlanDisplay: document.getElementById("billingPlanDisplay"),
  securityState: document.getElementById("securityState"),
  moduleChips: document.getElementById("moduleChips"),
  activityList: document.getElementById("activityList"),
  workspaceForm: document.getElementById("workspaceForm"),
  workspaceInput: document.getElementById("workspaceInput"),
  companyInput: document.getElementById("companyInput"),
  useCaseInput: document.getElementById("useCaseInput"),
  workspaceSubmit: document.getElementById("workspaceSubmit"),
  workspaceFeedback: document.getElementById("workspaceFeedback"),
  subscriptionFeedback: document.getElementById("subscriptionFeedback")
};

let firebaseApp = null;
let auth = null;
let db = null;

function setText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function setBusy(button, busy, label) {
  if (!button) {
    return;
  }
  button.disabled = busy;
  if (label) {
    button.textContent = label;
  }
}

function setAuthState(title, text, badge) {
  setText(elements.authStatusTitle, title);
  setText(elements.authStatusText, text);
  setText(elements.authStateBadge, badge);
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function moduleMapToList(modules) {
  const source = modules && typeof modules === "object" ? modules : {};
  return Object.entries(source)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([name]) => name);
}

function renderModuleChips(modules) {
  if (!elements.moduleChips) {
    return;
  }
  const activeModules = moduleMapToList(modules);
  const items = activeModules.length ? activeModules : ["cleanup", "workspace", "threats"];
  elements.moduleChips.innerHTML = items.map((item) => `<span class="module-chip">${item}</span>`).join("");
}

function renderActivity(items) {
  if (!elements.activityList) {
    return;
  }
  elements.activityList.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function buildActivity(profile, workspace) {
  const items = [];
  const workspaceName = String(workspace?.name || "Workspace");
  const company = String(profile?.company || "").trim();
  const useCase = String(profile?.useCase || "").trim();

  items.push(`Workspace carregado: ${workspaceName}.`);
  items.push(`Plano atual: ${String(workspace?.plan || "pro").toUpperCase()}.`);
  if (company) {
    items.push(`Empresa registrada: ${company}.`);
  }
  if (useCase) {
    items.push(`Uso principal salvo: ${useCase}`);
  }
  items.push("Base pronta para ativacao comercial, billing e eventos futuros.");
  return items;
}

function getDefaultProfile(user) {
  const email = String(user.email || "").trim();
  const displayName = email ? email.split("@")[0] : "Conta Pro";
  return {
    ownerUid: user.uid,
    email,
    displayName,
    company: "",
    useCase: "",
    plan: "starter",
    status: "lead",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastSignInAt: serverTimestamp()
  };
}

function getDefaultWorkspace(user) {
  const emailName = String(user.email || "workspace")
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim();
  const workspaceName = emailName ? `Workspace ${emailName}` : "Workspace NFiles";
  return {
    ownerUid: user.uid,
    name: workspaceName,
    slug: slugify(workspaceName),
    desktopVersion: String(config.productVersion || "8.0.4"),
    portalVersion: String(config.productVersion || "8.0.4"),
    plan: "starter",
    status: "lead",
    primaryUseCase: "",
    modules: {
      cleanup: true,
      workspace: true,
      threats: true,
      automations: true,
      cloud: false
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function getDefaultSubscription() {
  return {
    plan: "pro",
    billingStatus: "pending",
    provider: "hotmart",
    checkoutUrl: String(config.purchaseUrl || config.hotmartCheckoutUrl || ""),
    licenseId: "",
    statusNote: ""
  };
}

async function ensureUserDocuments(user) {
  const profileRef = doc(db, profilesCollection, user.uid);
  const workspaceRef = doc(db, workspacesCollection, user.uid);
  const subscriptionRef = doc(db, subscriptionsCollection, user.uid);
  const [profileSnap, workspaceSnap, subscriptionSnap] = await Promise.all([
    getDoc(profileRef),
    getDoc(workspaceRef),
    getDoc(subscriptionRef)
  ]);

  if (!profileSnap.exists()) {
    await setDoc(profileRef, getDefaultProfile(user), { merge: true });
  } else {
    await setDoc(
      profileRef,
      {
        ownerUid: user.uid,
        email: String(user.email || ""),
        lastSignInAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  }

  if (!workspaceSnap.exists()) {
    await setDoc(workspaceRef, getDefaultWorkspace(user), { merge: true });
  }

  const [freshProfileSnap, freshWorkspaceSnap, freshSubscriptionSnap] = await Promise.all([
    getDoc(profileRef),
    getDoc(workspaceRef),
    getDoc(subscriptionRef)
  ]);
  return {
    profile: freshProfileSnap.data() || getDefaultProfile(user),
    workspace: freshWorkspaceSnap.data() || getDefaultWorkspace(user),
    subscription: freshSubscriptionSnap.data() || getDefaultSubscription()
  };
}

function hydrateWorkspace(profile, workspace, subscription, user) {
  const effectivePlan = String(subscription?.plan || workspace?.plan || profile?.plan || "pro").toUpperCase();
  const effectiveBilling = String(subscription?.billingStatus || "pending");

  setText(elements.workspaceName, String(workspace?.name || "Workspace sem nome"));
  setText(elements.workspacePlan, `Plano ${effectivePlan}`);
  setText(elements.workspaceStatus, String(workspace?.status || "active"));
  setText(elements.portalVersion, `v${String(workspace?.portalVersion || config.productVersion || "8.0.4")}`);
  setText(elements.profileDisplayName, String(profile?.displayName || user.email || "Conta Pro"));
  setText(elements.profileEmail, String(profile?.email || user.email || ""));
  setText(elements.planDisplay, effectivePlan);
  setText(elements.billingStatusDisplay, effectiveBilling.replace(/_/g, " ").toUpperCase());
  setText(elements.billingPlanDisplay, `Plano ${effectivePlan} com provider ${String(subscription?.provider || "hotmart").toUpperCase()}.`);
  setText(elements.securityState, portalConfig.enableAppCheck ? "Rules + App Check" : "Rules ativas");

  if (elements.workspaceInput) {
    elements.workspaceInput.value = String(workspace?.name || "");
  }
  if (elements.companyInput) {
    elements.companyInput.value = String(profile?.company || "");
  }
  if (elements.useCaseInput) {
    elements.useCaseInput.value = String(profile?.useCase || workspace?.primaryUseCase || "");
  }
  renderModuleChips(workspace?.modules || {});
  renderActivity(buildActivity(profile, workspace));
}

function resetWorkspaceView() {
  setText(elements.workspaceName, "Workspace aguardando configuracao");
  setText(elements.workspacePlan, "Plano Pro");
  setText(elements.workspaceStatus, "Pre-onboarding");
  setText(elements.profileDisplayName, "Conta nao autenticada");
  setText(elements.profileEmail, "Entre com um email valido para persistir o perfil e o workspace.");
  setText(elements.billingStatusDisplay, "PENDENTE");
  setText(elements.billingPlanDisplay, "Planos Pro e Premium disponíveis pelo atendimento oficial.");
  renderModuleChips(null);
  renderActivity(["Conecte sua conta para gerar atividade persistida do workspace."]);
}

async function trackPortalEvent(user, kind, extra = {}) {
  if (!db || !user) {
    return;
  }
  try {
    await addDoc(collection(db, eventsCollection), {
      ownerUid: user.uid,
      kind: String(kind || "portal_event").slice(0, 40),
      channel: "web_portal",
      plan: String(extra.plan || "").slice(0, 20),
      status: String(extra.status || "").slice(0, 40),
      workspaceName: String(extra.workspaceName || "").slice(0, 80),
      createdAt: serverTimestamp()
    });
  } catch (_error) {
    // Keep the portal responsive even if event ingestion fails.
  }
}

async function completeEmailLink(authInstance) {
  if (!isSignInWithEmailLink(authInstance, window.location.href)) {
    return false;
  }
  let email = window.localStorage.getItem(storageKey) || "";
  if (!email) {
    email = window.prompt("Confirme o email usado para entrar no portal:") || "";
  }
  if (!email) {
    setText(elements.authFeedback, "Nao foi possivel confirmar o email do link.");
    return true;
  }
  setAuthState("Validando acesso", "Estamos confirmando o link magico do portal.", "Entrando");
  await signInWithEmailLink(authInstance, email, window.location.href);
  window.localStorage.removeItem(storageKey);
  const cleanUrl = new URL(portalUrl);
  window.history.replaceState({}, document.title, cleanUrl.pathname);
  return true;
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (!auth || !elements.authEmail) {
    return;
  }
  const email = String(elements.authEmail.value || "").trim();
  if (!email) {
    setText(elements.authFeedback, "Informe um email valido para continuar.");
    return;
  }

  setBusy(elements.authSubmit, true, "Enviando link...");
  try {
    await sendSignInLinkToEmail(auth, email, {
      url: portalUrl,
      handleCodeInApp: true
    });
    window.localStorage.setItem(storageKey, email);
    setText(
      elements.authFeedback,
      "Link enviado. Abra o email na mesma maquina para concluir a entrada no portal."
    );
    setAuthState("Link enviado", `Enviamos um acesso magico para ${email}.`, "Aguardando confirmacao");
  } catch (error) {
    setText(elements.authFeedback, `Falha ao enviar o link: ${error.message}`);
  } finally {
    setBusy(elements.authSubmit, false, "Enviar link magico");
  }
}

async function handleWorkspaceSubmit(event) {
  event.preventDefault();
  if (!auth || !db || !auth.currentUser) {
    setText(elements.workspaceFeedback, "Faca login no portal antes de salvar o workspace.");
    return;
  }

  const user = auth.currentUser;
  const workspaceName = String(elements.workspaceInput?.value || "").trim();
  const company = String(elements.companyInput?.value || "").trim();
  const useCase = String(elements.useCaseInput?.value || "").trim();

  if (!workspaceName) {
    setText(elements.workspaceFeedback, "Defina um nome para o workspace.");
    return;
  }

  setBusy(elements.workspaceSubmit, true, "Salvando...");
  try {
    await setDoc(
      doc(db, profilesCollection, user.uid),
      {
        ownerUid: user.uid,
        email: String(user.email || ""),
        displayName: workspaceName,
        company,
        useCase,
        updatedAt: serverTimestamp(),
        lastSignInAt: serverTimestamp()
      },
      { merge: true }
    );

    await setDoc(
      doc(db, workspacesCollection, user.uid),
      {
        ownerUid: user.uid,
        name: workspaceName,
        slug: slugify(workspaceName),
        desktopVersion: String(config.productVersion || "8.0.4"),
        portalVersion: String(config.productVersion || "8.0.4"),
        primaryUseCase: useCase,
        modules: {
          cleanup: true,
          workspace: true,
          threats: true,
          automations: true,
          cloud: false
        },
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    const data = await ensureUserDocuments(user);
    hydrateWorkspace(data.profile, data.workspace, data.subscription, user);
    setText(elements.workspaceFeedback, "Workspace salvo com sucesso no Firestore.");
    await trackPortalEvent(user, "workspace_saved", {
      plan: String(data.subscription?.plan || "pro"),
      status: String(data.workspace?.status || "active"),
      workspaceName
    });
  } catch (error) {
    setText(elements.workspaceFeedback, `Falha ao salvar o workspace: ${error.message}`);
  } finally {
    setBusy(elements.workspaceSubmit, false, "Salvar workspace");
  }
}

async function bootstrapPortal() {
  if (!firebaseConfig || !firebaseConfig.projectId) {
    setAuthState("Configuracao ausente", "Preencha o firebaseConfig em config.js para ativar o portal.", "Sem config");
    setText(elements.authFeedback, "Firebase nao configurado no front-end.");
    return;
  }

  firebaseApp = initializeApp(firebaseConfig);
  if (portalConfig.enableAppCheck && portalConfig.appCheckKey) {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(String(portalConfig.appCheckKey)),
      isTokenAutoRefreshEnabled: true
    });
  }

  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);

  if (elements.authForm) {
    elements.authForm.addEventListener("submit", handleAuthSubmit);
  }
  if (elements.workspaceForm) {
    elements.workspaceForm.addEventListener("submit", handleWorkspaceSubmit);
  }
  if (elements.signOutButton) {
    elements.signOutButton.addEventListener("click", async () => {
      await signOut(auth);
    });
  }

  await completeEmailLink(auth);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (elements.signOutButton) {
        elements.signOutButton.hidden = true;
      }
      setAuthState("Conecte seu email", "Entre com email link para ativar o perfil SaaS e carregar seu workspace.", "Aguardando login");
      setText(elements.authFeedback, "O login usa email link no Firebase. Ative esse provedor no console para operacao plena.");
      resetWorkspaceView();
      return;
    }

    if (elements.signOutButton) {
      elements.signOutButton.hidden = false;
    }
    setAuthState("Conta conectada", `Acesso autenticado para ${user.email || "usuario ativo"}.`, "Conectado");

    try {
      const data = await ensureUserDocuments(user);
      hydrateWorkspace(data.profile, data.workspace, data.subscription, user);
      setText(elements.authFeedback, "Portal autenticado e sincronizado com o Firestore.");
      setText(elements.workspaceFeedback, "Edite e salve o onboarding para personalizar o workspace.");
      setText(elements.subscriptionFeedback, "Revise plano, billing e licenca para consolidar a conta.");
      await trackPortalEvent(user, "auth_completed", {
        plan: String(data.subscription?.plan || "pro"),
        status: String(data.subscription?.billingStatus || "pending"),
        workspaceName: String(data.workspace?.name || "")
      });
    } catch (error) {
      setText(elements.authFeedback, `Falha ao carregar dados do portal: ${error.message}`);
    }
  });
}

bootstrapPortal().catch((error) => {
  setAuthState("Falha no portal", "A camada SaaS nao conseguiu inicializar.", "Erro");
  setText(elements.authFeedback, `Erro ao iniciar o portal: ${error.message}`);
});
