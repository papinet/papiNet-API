## Tools

This `tools/` folder does contain a few tools/scripts that help us to develop the papiNet API standard.

### `analyse-uom.js`

This script will list all the `uom` (unit of measure) within the schemas of the papiNet API OpenAPI documentation.

```text
node analyse-uom.js
```

### `validate.cmd`

This script will validate all the instances within the `..\3.0.0\mock\` folder against their respective schemas from the papiNet API OpenAPI documentation.

This script is using the `yq` and `ajv` commands. The `ajv` command is using [Node.js](https://nodejs.org/en).

```text
validate.cmd
```

#### How to install `yq` on Windows without administrative rights

1\. Download the latest version of the binary `yq_windows_amd64.zip` at <https://github.com/mikefarah/yq/releases/latest>

2\. Create a new subfolder `yq` within the folder `C:\Users\{Username}\AppData\Local\Programs`.

3\. Unzip the file `yq_windows_amd64.exe` from the `yq_windows_amd64.zip` archive into the folder `C:\Users\{Username}\AppData\Local\Programs\yq` and rename it to `yq.exe`.

4\. From a Windows Command Prompt run the following command:

```text
rundll32.exe sysdm.cpl,EditEnvironmentVariables
```

5\. From the "User variables for {Username}" section, click on the "New..." button to create a new variable with the name `YQ_BIN` and the value `C:\Users\{Username}\AppData\Local\Programs\yq`.

6\. From the "User variables for {Username}" section, select the `Path` variable and click on the "Edit.." button, then click on the "New" button and add the line `%YQ_BIN%` at the end.

7\. From a **new** Windows Command Prompt run the following command to verify the installation:

```text
yq --version
```

#### How to install Node.js on Windows without administrative rights

1\. Download the latest version at <https://nodejs.org/en/download>; Click on the "Standalone Binary (.zip)" button while having selected "Windows" as _operating system_ and "x64" as _architecture_.

2\. 3\. Unzip the folder `node-v22.12.0-win-x64` from `node-v22.12.0-win-x64.zip` archive into the folder `C:\Users\{Username}\AppData\Local\Programs`.

3\. From a Windows Command Prompt run the following command:

```text
rundll32.exe sysdm.cpl,EditEnvironmentVariables
```

4\. From the "User variables for {Username}" section, click on the "New..." button to create a new variable with the name `NODE_BIN` and the value `C:\Users\{Username}\AppData\Local\Programs\node-v22.12.0-win-x64`.

5\. From the "User variables for {Username}" section, select the `Path` variable and click on the "Edit.." button, then click on the "New" button and add the line `%NODE_BIN%` at the end.

6\. From a **new** Windows Command Prompt run the following command to verify the installation:

```text
node --version
```

```text
npm --version
```

#### How to install `ajv` on Windows (without administrative rights)

```text
npm install -g ajv-cli
```

```text
npm install -g ajv-formats
```

### `check-instances-with-markdown-and-pact.py` (work in progress)

This Python script analyzes if the instances within the `..\3.0.0\mock\` folder are used within the use case file `..\3.0.0\paper-board-pulp-warehouse-logistics.md` and the Pact file `..\3.0.0\papiNet.PACT.json`.

```text
python check-instances-with-markdown-and-pact.py
```

You can install Python without administrative rights using the Python Windows Installer available at <https://www.python.org/downloads/>.
