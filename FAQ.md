# ❓ Perguntas Frequentes - NFiles IA

## 🚀 Instalação e Primeiros Passos

### P: Como faço para instalar o NFiles IA?

**R:** Existem duas formas:

1. **Instalador (Recomendado)**
   - Baixe `NFilesIA_Setup_v8.0.4.exe` em [Releases](../../releases)
   - Execute e siga as instruções
   - Clique em "Instalar"

2. **ZIP Portável**
   - Baixe `NFilesIA-v8.0.4-win64.zip`
   - Extraia em uma pasta qualquer
   - Execute `NFilesIA.exe`

### P: Qual é o tamanho da instalação?

**R:** 
- Instalador: ~245 MB
- ZIP Portável: ~235 MB
- Após instalação: ~500 MB

### P: Preciso de conexão com a internet?

**R:** Não é necessário para operações locais. Conexão é usada apenas para:
- Atualizar dados da IA
- Conectar ao Google Colab (opcional)
- Pesquisa web supervisionada

### P: Funciona no Windows 10?

**R:** Sim! NFiles IA suporta:
- Windows 10 (versão 1909 ou superior)
- Windows 11

---

## 💻 Requisitos do Sistema

### P: Quanto de memória RAM preciso?

**R:**
- **Mínimo recomendado:** 4 GB
- **Ideal:** 8 GB ou mais
- **Para IA local:** 16 GB+ (processamento mais rápido)

### P: Preciso de GPU?

**R:** Não é necessário. NFiles IA funciona com processamento em CPU, mas:
- GPU NVIDIA com CUDA acelera processamento
- Google Colab oferece aceleração gratuita alternativa

### P: Quanto de espaço em disco preciso?

**R:** 
- Instalação: ~500 MB
- Cache de operações: ~100 MB
- Recomendado: 2 GB livres para operações sem problemas

---

## 🤖 Funcionalidades da IA

### P: O NFiles IA funciona sem internet?

**R:** Sim! A IA local funciona offline. Para usar:
1. Instale o modelo local durante a primeira execução
2. Use o chat normalmente
3. Google Colab é opcional para acelerar

### P: Posso usar minha própria sessão do Google Colab?

**R:** Sim! Passos:
1. Abra NFiles IA
2. Vá para Configurações → IA
3. Selecione "Usar Google Colab"
4. Cole sua chave de sessão do Colab
5. Clique em "Conectar"

⚠️ **Importante:** Nunca compartilhe sua chave do Colab publicamente!

### P: A IA pode aprender com meus documentos?

**R:** Sim, através de RAG (Retrieval Augmented Generation):
1. Adicione documentos ao "Banco de Conhecimento"
2. A IA indexa e compreende o conteúdo
3. Respostas incluem informações dos seus docs
4. Seus dados permanecem locais (privado)

### P: Quais formatos de arquivo a IA suporta?

**R:** 
- Texto: `.txt`, `.md`, `.log`
- Documentos: `.pdf`, `.docx`, `.xlsx`, `.pptx`
- Em breve: imagens (OCR) e áudio

---

## 📁 Organização e Limpeza

### P: Como funciona a detecção de duplicados?

**R:**
1. Clique em "Ferramentas" → "Encontrar Duplicados"
2. Selecione a pasta para varredura
3. Escolha critério: nome exato, tamanho, conteúdo
4. Revise resultados
5. Confirme exclusão (reversível com Desfazer)

### P: Posso recuperar arquivos deletados?

**R:**
- **Dentro do NFiles IA:** Clique em "Desfazer" (Ctrl+Z)
- **Via Lixeira do Windows:** Arquivos vão para Lixeira antes de exclusão permanente
- **Backup:** Mantenha backups regulares

### P: Como a limpeza guiada funciona?

**R:**
1. Análise: NFiles IA escaneia sua pasta
2. Categorização: agrupa por tipo (temporários, duplicados, etc)
3. Revisão: você vê cada item antes de agir
4. Confirmação: você confirma exclusão
5. Relatório: resumo do que foi feito

---

## 🔒 Segurança e Privacidade

### P: Meus dados são seguros?

**R:** Sim! Medidas de segurança:
- Processamento local (IA em seu PC)
- Sem envio automático de dados
- Dados pessoais nunca são usados para treinar IA
- Criptografia local de configurações

### P: O que o NFiles IA faz com meus arquivos?

**R:**
- Lê apenas para processar (organizar, detectar duplicados)
- Não modifica sem sua confirmação explícita
- Não faz backup automático
- Não compartilha com terceiros

### P: Meus dados vão para a nuvem?

**R:** Não, a menos que você:
- Use Google Colab (seus dados vão para servidores Google)
- Ative sincronização manual
- Ative pesquisa web

Tudo é controle do usuário!

---

## 🐛 Problemas e Soluções

### P: NFiles IA não inicia!

**R:** Tente:
1. Reiniciar seu computador
2. Desinstalar e reinstalar
3. Verificar se Windows está atualizado
4. [Relatar no GitHub](../../issues)

### P: Erro "Não há memória suficiente"

**R:**
1. Feche outros programas
2. Reduza tamanho das pastas analisadas
3. Use Google Colab em vez de IA local
4. Adicione mais RAM (se possível)

### P: A IA está lenta

**R:**
- **Solução 1:** Feche abas do navegador
- **Solução 2:** Use Google Colab
- **Solução 3:** Reduza tamanho do banco de conhecimento
- **Solução 4:** Reinicie o app

### P: O Windows SmartScreen bloqueia a instalação

**R:** Comportamento esperado (app ainda não tem assinatura comercial):
1. Clique em "Mais informações"
2. Clique em "Executar assim mesmo"
3. Será assinado em release estável futuro

---

## 📊 Atualizações e Versões

### P: Como atualizo para a versão mais recente?

**R:**
1. Baixe a versão nova em [Releases](../../releases)
2. Execute o novo instalador
3. Suas configurações são preservadas
4. Versão antiga é substituída

### P: Posso usar múltiplas versões?

**R:** Sim!
- Use versão estável para trabalho
- Use versão beta em pasta separada para testes
- ZIP Portável é ideal para isso

### P: Como retirar meu feedback sobre bugs?

**R:** [Abra uma issue](../../issues/new?template=bug_report.yml) com:
- Descrição clara do problema
- Passos para reproduzir
- Screenshots (sem dados pessoais)
- Versão do NFiles IA

---

## 💡 Dicas e Truques

### P: Como organizar meu PC rapidamente?

**R:** Fluxo recomendado:
1. **Limpeza:** Rode "Limpeza Guiada" inicialmente
2. **Duplicados:** Procure por arquivos duplicados
3. **Organização:** Use tags para categorizar
4. **Monitoramento:** Configure alertas de espaço

### P: Qual é a melhor forma de usar a IA?

**R:** Dicas:
- Seja específico em perguntas
- Inclua arquivos relevantes (anexos)
- Revise respostas antes de agir
- Use como assistente, não como verdade absoluta

### P: Posso usar NFiles IA para trabalho?

**R:** Sim! Ideal para:
- Organizar arquivos de projetos
- Limpeza de drives compartilhados
- Análise de documentos
- Categorização automática

---

## 📧 Ainda tem dúvidas?

**Entre em contato:**
- 📧 Email: neurofilesaipro@hotmail.com
- 🐛 Issues: [Abra uma issue](../../issues)
- 💬 Discussões: Em breve!

---

*Última atualização: 01/09/2026*
