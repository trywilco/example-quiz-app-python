WILCO_ID="`cat .wilco`"
CODESPACE_BACKEND_HOST=$(curl -s "${ENGINE_BASE_URL}/api/v1/codespace/backendHost?codespaceName=${CODESPACE_NAME}&portForwarding=${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}" | jq -r '.codespaceBackendHost')
CODESPACE_BACKEND_URL="https://${CODESPACE_BACKEND_HOST}"
export ENGINE_EVENT_ENDPOINT="${ENGINE_BASE_URL}/users/${WILCO_ID}/event"

# Update engine that codespace started for user
curl -L -X POST "${ENGINE_EVENT_ENDPOINT}" -H "Content-Type: application/json" --data-raw "{ \"event\": \"github_codespace_started\" }"

gh codespace ports visibility 3000:public --codespace $CODESPACE_NAME
gh codespace ports visibility 3001:public --codespace $CODESPACE_NAME

# Export backend envs when in codespaces
echo "export CODESPACE_BACKEND_HOST=\"${CODESPACE_BACKEND_HOST}\"" >> ~/.bashrc
echo "export CODESPACE_BACKEND_URL=\"${CODESPACE_BACKEND_URL}\"" >> ~/.bashrc
echo "export CODESPACE_WDS_SOCKET_PORT=443" >> ~/.bashrc

# Export welcome prompt in bash:
echo "printf \"\n\n☁️☁️☁️️ Develop in the Cloud ☁️☁️☁️\n\"" >> ~/.bashrc

nohup bash -c "cd /wilco-agent && node agent.js &" >> /tmp/agent.log 2>&1 