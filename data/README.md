<!-- LTeX: language=en -->

# Initialize Git Submodule to fetch apis.guru Data

- First initialize the submodule: `git submodule init`
- After initialization, update the submodule to fetch the content: `git submodule update` (this step can take several minutes)

# Download the Data from Git LFS

- Make sure editors of lfs files are closed as large file size might cause IDE to crash
- execute `git lfs pull`
