# To install node dependencies:

Navigate to the client or server folder and run:  

```bash
npm install
```

*Example C:/Workspace/dt/lab-2/1 npm install*

__browser-sync__ library serves the frontend to the browser and also reloads the browser when we change the source files. When we open the client in two different tabs or windows and press on send button we will trigger the send event handler twice.

__live-server__ library serves and automatically reloads the frontend and provides an application scope in which the events are triggered only whithin the tab where the client is opened.

__nodemon__ library is used to run and automatically reload the server if we change any source files.

These dependencies are tools that help us to run the client/server JS applications.

# Run command

Navigate to the client or server folder and run:  

```bash
npm run start
```

*Example C:/Workspace/dt/lab-2/1 npm run start*

You can find the __start__ command defined in *package.json*.

# Important

Always start the server first and the client afterwards.