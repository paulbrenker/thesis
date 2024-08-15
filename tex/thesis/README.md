<!-- LTeX: language=en -->
# Working with LaTeX in VsCode

To work with LaTeX in the VSCode IDE [this](https://medium.com/@timju/latex-setup-with-vs-code-and-docker-612f998e1f23) tutorial has been used. In short:

**Prerequisites**:

- [Docker for Mac](https://www.docker.com/) must be installed on your machine (Following commands expect Apple Silicon but can easily be adapted to other environment)
- [VSCode](https://code.visualstudio.com/) must be installed

**Installing**:

- Pull the latest Docker Image with TexLive: `docker pull --platform linux/amd64/v8 ghcr.io/xu-cheng/texlive-full:latest`
- Install VsCode Extension LaTeX Workshop (Recommended through `.vscode/extensions`) Extension ID: `James-Yu.latex-workshop`
- Go to any `.tex` File. Building LaTeX project will be automatically triggered on save. A `.pdf` preview can be found at `tex/out/main.pdf`
