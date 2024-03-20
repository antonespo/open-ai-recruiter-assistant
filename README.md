# Recruiter Assistant using OpenAI

This repository contains the source code for a simple application that uses OpenAI's GPT-4 model to process and summarize key aspects of a candidate's CV. The assistant can identify the technologies a candidate has worked with and the duration of their experience. Reasonably named "Recruiter Assistant", this assistant helps ease recruiters' work by automating the initial CV screening and assessment step.

## Prerequisites

Before running the project, make sure you have:
- Node.js installed.
- An OpenAI account (create one [here](https://beta.openai.com/signup/)).
- The OpenAI API key obtained from your OpenAI account.

## Installation

1. Clone the repository:
    ```shell
    git clone https://github.com/antonespo/open-ai-recruiter-assistant.git
    ```

2. Install the required packages:
    ```shell
    npm install
    ```

## Setting up environment variables

1. Create a file named `.env` in the root directory of the project.
2. Copy the below contents into `.env` file:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

Make sure to replace `your_openai_api_key` with your actual API key obtained from OpenAI.

## Running the Application

To run the application, execute:
```shell
npm start
