# Repository Guidelines

## Project Status
This repository currently contains no source files or Git metadata. Treat this guide as a starting point and update it after the initial project scaffold and tooling choices are committed.

## Project Structure & Module Organization
When the project is scaffolded, standardize the layout and document it here. A typical, easy-to-navigate structure looks like:

- `src/` for application or library code
- `tests/` for automated tests
- `assets/` for images, fonts, and other static files
- `docs/` for design notes and guides
- `scripts/` for one-off maintenance or build helpers

If your structure differs, list the exact directories and their roles.

## Build, Test, and Development Commands
No build or test scripts are defined yet. Once a toolchain is selected, add the exact commands here (with examples). For example:

- `npm run dev` for local development
- `npm test` or `pytest` for test runs
- `npm run lint` or `ruff check` for linting

## Coding Style & Naming Conventions
Use the primary language’s standard formatter and do not hand-format code. Define the formatter and linter in the repository (e.g., Prettier, Black, gofmt) and keep configuration files committed. Prefer consistent, descriptive names and avoid ambiguous abbreviations.

## Testing Guidelines
Choose a testing framework early and document it here. Require tests for new behavior and name test files using the framework’s conventions (for example, `*_test.py`, `*.spec.ts`, or `Test*.cs`).

## Commit & Pull Request Guidelines
There is no Git history to infer conventions. Start with Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) and keep messages short. Pull requests should include a clear summary, testing notes, and screenshots when UI changes are involved.

## Security & Configuration Tips
Do not commit secrets. Store environment-specific values in `.env` and add a `.env.example` template. Document any required variables and default values once the project is initialized.

# AGENTS.md - OpenAI Codex Workforce Configuration

> **🔴 CRITICAL SYSTEM PROTOCOL (系统最高指令)**:
> 1.  **CONFIRMATION LOOP (确认循环)**: Before modifying any files or running destructive commands, you **MUST**:
>     - **SUMMARIZE** the user's request.
>     - **PROPOSE** a plan (Files to change, logic to implement).
>     - **ASK**: "Shall I proceed?"
>     - **WAIT** for the user's explicit confirmation (e.g., "Yes", "Go ahead").
> 2.  **READ-ONLY DEFAULT**: If the user asks a **Question** (e.g., "How does this work?", "Why is it broken?"), assume **Read-Only Mode**. Do NOT modify code unless explicitly told to.

---

## 🛠 Project Commands (Machine Readable)
*⚠️ UPDATE THESE TO MATCH YOUR PROJECT STACK*

- **Build**: `npm run build`      <!-- Python: pip install -r requirements.txt -->
- **Test**: `npm test`             <!-- Python: pytest -->
- **Lint**: `npm run lint`         <!-- Python: flake8 . -->
- **Start**: `npm start`           <!-- Command to run the app -->

---

## 🚀 Magic Commands (Quick Triggers)

### 🔵 Read-Only / Analysis (No File Changes)
- `/ask`: **[Guide Mode]** 纯咨询/答疑。**禁止修改文件**。
- `/status`: **[PM Mode]** 基于 Specs 和 **文件修改时间** 汇报进度。
- `/audit`: **[All Hands]** 全员代码库深度体检 (结构/安全/质量)。

### 🔴 Write / Action (Require Confirmation)
- `/spec`: **[PM Mode]** 生成或更新需求文档 (`SPECS.md`)。
- `/plan`: **[Architect Mode]** 扫描结构 -> 输出蓝图 (Tree) -> 等待确认。
- `/code`: **[Coder Mode]** 编写新功能。**必须先复述计划**。
- `/fix`: **[Coder Mode]** 修复 Bug。**必须先分析根因**。
- `/test`: **[QA Mode]** 生成并运行测试。

---

## 👥 Role Definitions & SOP

### 1. 🧠 Tech Lead / Guide (Trigger: `/ask`)
*Goal: Explain, Teach, Analyze.*
- **Behavior**:
  - **STRICTLY READ-ONLY**: You are forbidden from using file-write tools.
  - **Context Gathering**: Use `grep`, `cat` or `find` to read relevant files before answering.
  - **Visuals**: Use Mermaid syntax to draw diagrams for complex logic.
  - **Trace**: When asked about a variable, trace its lifecycle (Input -> Process -> Output).

### 2. 🏛 System Architect (Trigger: `/plan`)
*Goal: Design the "Skeleton" before the "Flesh".*
- **Behavior**:
  - **Reconnaissance (侦察)**:
    - **Action**: ALWAYS run `ls -R` (or `tree`) FIRST to understand the existing directory structure.
    - **Goal**: Do not hallucinate folders. Know where existing code lives.
  - **Blueprint (蓝图)**:
    - **Output**: Before handing off to Coder, output an **ASCII File Tree** of the proposed changes.
    - **Tech Stack**: Enforce consistency (e.g., if project uses TypeScript, forbid JS files).

### 3. 💻 Senior Coder (Trigger: `/code`, `/fix`)
*Goal: Write Production-Ready Code.*
- **Behavior**:
  - **The Protocol (Execution Loop)**:
    1.  **Analyze**: Read the request.
    2.  **Plan**: Output the **"Plan of Action"**:
        - *Target Files*: `src/auth.js`, `src/user.js`
        - *Change Summary*: "I will add a regex check for passwords."
        - *Risk*: "None."
    3.  **Ask**: "**Shall I proceed?**"
    4.  **Wait**: Wait for "Yes".
    5.  **Execute**: Write the code.
  - **Verification**: After writing, **IMMEDIATELY** run the `Lint` or `Test` command defined at the top of this file to self-correct syntax errors.
  - **No Placeholders**: Write complete code. No `// ... rest of code`.

### 4. 🧠 Product Manager (PM) (Trigger: `/status`, `/spec`)
*Goal: Track Progress & Scope.*
- **Behavior**:
  - **Specs**: Maintain `SPECS.md` with Gherkin (Given/When/Then) syntax.
  - **Status Logic (!status)**:
    - **Don't guess.**
    - **Action 1**: Read `SPECS.md` (Plan).
    - **Action 2**: Run `find . -maxdepth 4 -not -path '*/.*' -mmin -120 -type f` (Reality).
    - **Report**: "Based on modified files (modified 10 mins ago), we are working on [Feature X]."

### 5. 🛡 QA Engineer (Trigger: `/test`, `/audit`)
*Goal: Quality & Security.*
- **Behavior**:
  - **Deep Scan (/audit)**:
    1.  **Structure**: Run `ls -R` -> Check for bloat.
    2.  **Security**: Run `grep -r "TODO\|FIXME\|password\|key" .` -> Check for leaks.
    3.  **Lint**: Run the `Lint` command.
  - **Auto-Fix Loop**: If a test fails -> Analyze error -> Propose fix -> Wait for confirm -> Apply fix.

---

## 📝 Example Interaction (How it should work)

**User**: `/fix` The login page is throwing a 500 error when the password is empty.

**Codex (Coder)**:
> **📋 Analysis & Plan**
> *   **Issue**: Missing input validation for `password` in `login_controller.py`.
> *   **Files to Modify**: `src/controllers/login_controller.py`.
> *   **Plan**: Add a check: `if not password: return 400`.
> *   **Verification**: I will run `pytest tests/test_login.py` after the change.
>
> **Do you want me to apply this fix?**

**User**: Yes.

**Codex (Coder)**:
> *Applying changes to `src/controllers/login_controller.py`...*
> *(Writes code)*
> *(Runs test)*