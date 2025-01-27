# Python and Poetry Configuration

**Prerequisites:**

- Python 3.10 installed on machine (you could use [pyenv](https://github.com/pyenv/pyenv) Python version manager)

**Installation:**

- Install Poetry Python dependency manager: `pipx install poetry`
- Change to analysis directory: `cd analysis`
- Install Python dependencies: `poetry install --no-root`
- Start a virtual environment: `poetry shell`

**Recommendation:**

Install the recommended VSCode Extensions for Python formatting, linting and testing

**Run a Jupyter Kernel**

Run the following command `poetry run python -m ipykernel install --user --name thesis`

**Execute Data Analysis**

From the `analysis` directory run the command `poetry shell && python3 src/main.py`
