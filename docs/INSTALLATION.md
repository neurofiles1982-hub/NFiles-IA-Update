# 📖 Guia de Instalação - NFiles IA

## 🚀 Início Rápido

### Método 1: Instalador (Recomendado para Iniciantes)

**Passo 1: Download**
1. Acesse [Releases](../../releases)
2. Clique em `NFilesIA_Setup_v8.0.4.exe`
3. Aguarde o download completar

**Passo 2: Instalação**
1. Abra o arquivo `.exe` (clique duas vezes)
2. Se o Windows SmartScreen aparecer:
   - Clique em "Mais informações"
   - Clique em "Executar assim mesmo"
3. Clique em "Instalar"
4. Escolha a pasta (padrão: `C:\Program Files\NFiles IA`)
5. Aguarde a instalação concluir
6. Clique em "Concluir"

**Passo 3: Primeiro Uso**
1. NFiles IA abrirá automaticamente
2. Aceite os termos de privacidade
3. Configure sua pasta padrão
4. Pronto! Você está dentro

---

### Método 2: ZIP Portável (Para Uso Portável)

**Passo 1: Download**
1. Acesse [Releases](../../releases)
2. Clique em `NFilesIA-v8.0.4-win64.zip`
3. Salve em uma pasta de sua escolha

**Passo 2: Extração**
1. Clique direito no arquivo `.zip`
2. Selecione "Extrair tudo..."
3. Escolha uma pasta (ex: `C:\NFiles-IA`)
4. Clique em "Extrair"

**Passo 3: Execução**
1. Abra a pasta extraída
2. Procure por `NFilesIA.exe`
3. Clique duas vezes para executar
4. Pronto! Nenhuma instalação necessária

---

## ✅ Verificação de Integridade

### Por que verificar?
Garante que o arquivo não foi corrompido ou modificado.

### Windows PowerShell

```powershell
# Abra PowerShell como administrador
# Vá até a pasta com o arquivo
# Execute:

(Get-FileHash "NFilesIA_Setup_v8.0.4.exe").Hash
```

**Deve retornar:**
```
0aef0271fdec46c9cb7febdfe6aac7392d3800e582fa90a87c992b7186a2114c
```

### Se for diferente:
- ❌ Arquivo pode estar corrompido
- ❌ Baixe novamente do GitHub oficial
- ❌ Não execute se os hashes não corresponderem

---

## 🔧 Requisitos do Sistema

### Mínimos (Funcional)
- **Windows:** 10 (v1909+) ou 11
- **RAM:** 4 GB
- **Disco:** 500 MB disponíveis
- **Processador:** Dual-core 2.0 GHz+

### Recomendados (Ideal)
- **Windows:** 11 (versão atual)
- **RAM:** 8 GB ou mais
- **Disco:** SSD com 2 GB disponíveis
- **Processador:** Intel i5/AMD Ryzen 5+
- **GPU:** NVIDIA/AMD com CUDA/OpenCL (opcional)

### Para IA Local
- **RAM:** 16 GB+ (muito recomendado)
- **Disco:** SSD com 3+ GB
- **GPU:** NVIDIA RTX 2060+

---

## 🌐 Google Colab (Acelerar IA)

### O que é?
Google Colab fornece poder computacional gratuito na nuvem.

### Pré-requisitos
1. Conta Google (crie se não tiver)
2. Conexão com internet
3. NFiles IA instalado

### Configuração

**Passo 1: Criar Sessão Colab**
1. Vá para [Google Colab](https://colab.research.google.com)
2. Crie um novo notebook
3. Copie o notebook ID (na URL)

**Passo 2: Configurar em NFiles IA**
1. Abra NFiles IA
2. Vá para `Configurações` → `IA`
3. Selecione "Usar Google Colab"
4. Cole seu notebook ID
5. Clique em "Conectar"
6. Teste a conexão

**Passo 3: Usar**
1. Escreva uma pergunta no chat
2. A IA usará o poder do Colab
3. Respostas serão mais rápidas

⚠️ **Importante:**
- Nunca compartilhe sua chave do Colab
- Sessão expira após inatividade

---

## 📥 Download da Base de Conhecimento RAG

### O que é RAG?
Retrieval Augmented Generation - permite que a IA aprenda com seus documentos.

### Download
1. Vá para [Releases](../../releases) → v8.0.4
2. Baixe `NFilesIA_RAG_v8.0.4.zip`
3. Extraia em uma pasta
4. Abra NFiles IA
5. Vá para `Banco de Conhecimento`
6. Importe a pasta extraída

### Atualizações
- Base de conhecimento é atualizada automaticamente
- Ou acesse `Configurações` → `Verificar Atualizações`

---

## 🚨 Solução de Problemas

### Problema: "Windows SmartScreen bloqueou"
**Solução:**
1. Clique em "Mais informações"
2. Clique em "Executar assim mesmo"
3. Isso é normal em apps não-assinados comercialmente
4. Será corrigido em breve

### Problema: "Arquivo corrompido"
**Solução:**
1. Verifique o hash SHA-256
2. Se não corresponder, baixe novamente
3. Tente outro navegador
4. Contate: neurofilesaipro@hotmail.com

### Problema: "Sem espaço em disco"
**Solução:**
1. Limpe arquivos temporários (Windows Limpeza de Disco)
2. Desinstale programas não usados
3. Use ferramenta "Limpeza" do NFiles IA
4. Obtenha um disco externo

### Problema: "Erro ao conectar Colab"
**Solução:**
1. Verifique conexão com internet
2. Valide notebook ID do Colab
3. Crie uma nova sessão Colab
4. Reinicie NFiles IA
5. [Reporte o bug](../../issues)

### Problema: "App não inicia"
**Solução:**
1. Reinicie o computador
2. Desinstale completamente
3. Baixe e reinstale versão recente
4. Tente a versão ZIP portável
5. [Reporte em Issues](../../issues)

---

## 🔄 Atualizações

### Verificar Atualizações
1. Abra NFiles IA
2. Menu `Ajuda` → `Verificar Atualizações`
3. Se houver, clique em "Atualizar"
4. Aguarde e reinicie

### Atualização Manual
1. Baixe a versão mais recente do [Releases](../../releases)
2. Execute o instalador
3. Suas configurações serão preservadas
4. Versão antiga será substituída

### Versões Beta
1. Prefere testar novos recursos?
2. Baixe versão Beta do [Releases](../../releases)
3. Use em máquina separada (sem riscos)
4. Reporte bugs e sugestões

---

## 🗑️ Desinstalação

### Método Padrão
1. Abra `Configurações` → `Aplicativos`
2. Procure por "NFiles IA"
3. Clique em "Desinstalar"
4. Confirme

### Método Manual
1. Pressione `Windows + R`
2. Digite: `appwiz.cpl`
3. Procure "NFiles IA"
4. Clique direito → Desinstalar
5. Confirme

### Remover Dados Pessoais
1. Abra `%AppData%\NFilesIA`
2. Exclua a pasta completamente
3. Isso remove: configurações, histórico, cache

---

## 📞 Precisa de Ajuda?

- 📖 [FAQ Completa](../FAQ.md)
- 🐛 [Reporte um Bug](../../issues/new?template=bug_report.yml)
- 💬 [Faça uma Pergunta](../../issues/new?template=question.md)
- 📧 Email: neurofilesaipro@hotmail.com

---

<div align="center">

**Pronto para começar? [⬇️ Baixe agora](../../releases/latest)**

[Voltar ao README](../README.md)

</div>
