import React from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';

const yamlLint = require('yaml-lint');

class YamlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yaml: ``,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Uses the yaml-lint library to determine if a given string is valid yaml.
  // If the code is invalid, it returns an error message detailing what went wrong.
  checkYaml = (y) => {
    yamlLint.lint(y).then(() => {
      alert('Valid YAML file.');
    }).catch((error) => {
      alert(error.message);
    });
  }

  // Calls checkYaml and passes in the value from the textarea
  handleChange = (e) => {
    this.setState({ yaml: e });
  }
  handleSubmit = (e) => {
    this.checkYaml(this.state.yaml);
    e.preventDefault();
  }

  render() {
    return (
      <Holder>
        <Editor onSubmit={this.handleSubmit}>
          <AceEditor
            mode='yaml'
            theme='monokai'
            onChange={this.handleChange}
            name='codeEditor'
            editorProps={{ $blockScrolling: true }}
            width='100%'
            defaultValue={`# Default Example Code
services:
    react:
        image: gcr.io/porter-dev-273614/react-server
        ports:
            - 8080
    mongo:
        image: gcr.io/porter-dev-273614/api-server
        ports:
            - 3000
            - 5000
            - 8080
        command: mongod --replSet rs0 --bind_ip 0.0.0.0
        expose: true
        volumes:
            - path: /data/db
              storage: 10GB
        environment:
            DATABASE_URL: https://postgres-{{identifier}}.getporter.dev
            FRONTEND_URL: https://react-{{identifier}}.getporter.dev
        resources:
            RAM: 1000Mi
            CPU: 0.25
        configmaps:
            - configmap: my-config
              path: /mycustompath`}
            style={{ 
              borderRadius: '16px',
              marginBottom: '12px',
            }}
          />
          <input type='submit' value='Check For Errors' />
        </Editor>
      </Holder>
    );
  }
}

export default YamlEditor;

const Holder = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #474842;
`;

const Editor = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;