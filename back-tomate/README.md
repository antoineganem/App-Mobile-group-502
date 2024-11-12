# How to run

## Prerequisites

1. Have Git Bash installed in your computer
2. Install pyenv
3. Install pipenv
4. Having the .env variables

### How to install pyenv

To install pyenv you can follow the [tutorial](https://medium.com/@diego.coder/instalar-múltiples-versiones-de-python-en-windows-con-pyenv-d6c3d006d83d)

Basically there are three main steps

### Installation Instructions for Pyenv on Windows

### 1. Enable Script Execution in PowerShell (Administrator Mode)

First, you need to enable the execution of scripts in PowerShell running as an Administrator. You can check the official documentation here: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies

Run the following command in PowerShell:

```powershell
Set-ExecutionPolicy Unrestricted
```

### 2. Install Pyenv

Next, use the following PowerShell command to install Pyenv:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
```

### 3. Verify Installation

After the installation is complete, close and reopen PowerShell. To verify that Pyenv has been installed successfully, run:

pyenv --version

If the installation was successful, this will display the version of Pyenv installed.

### 4. Install the py version

Open Git Bash

type `cd *your project location*/App-Mobile-group-502\back-tomate`

Change into the folder of the project _back-tomate_ when you are in the root there you should be able to see _flaskr, src, ..._ if you enter `ls` in the git bash

When in here you should enter the following

```bash
pyenv install 3.10.11
```

## Installing pipenv

Installing pipenv is a very straightforward process.

While being in the same folder location that you were for installing the py version

Enter the following in the bash

```bash
pip install pipenv
```

## Install all dependencies

```bash
pipenv install
```

## Getting the .env variables

Once you have all of the previous requisites ask Santi for the env variables.

1. Create a .env file inside back-tomate
2. Copy the values passed by Santi

## Running the project

Once you have successfully fullfilled the prerequisites you should be able to run the project.

To do so inside the back-tomate folder you can run the project in Git Bash

```Bash
./bootstrap.sh
```
