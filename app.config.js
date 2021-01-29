/*
  This file contains the main configuration for the tutorial
*/

/* Content components */
import Welcome from './pages/guidance/welcome.mdx';

export default {
  
  backendURL: "http://localhost:10000/wetty", 

  title: "Go-along tutorial template",
  greeting: "Welcome to My tutorial",
  description: "This tutorial will introduce you to the usage of this site template.",

  basePath: "",           // use this to configure basepaths for deployment
  entryPoint: "/lab",     // This is the URL for the lab (you need to change this for static deployments to lab.html)
  
  // Add new steps here after importing them
  steps: [
    Welcome,
  ],

}