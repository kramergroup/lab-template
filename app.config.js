/*
  This file contains the main configuration for the tutorial
*/

/* Content components */


export default {
  
  // backendType: "wetty",
  // backendURL: "https://assets.kramer.science/compdes/wetty", 

  backendType: "guacamole",
  backendURL: "ws://localhost:8080",
  backendToken: "MySuperSecretKeyForParamsToken12",

  title: "Go-along tutorial template",
  greeting: "Welcome to My tutorial",
  description: "This tutorial will introduce you to the usage of this site template.",

  basePath: "",           // use this to configure basepaths for deployment
  entryPoint: "/lab",     // This is the URL for the lab (you need to change this for static deployments to lab.html)
  
}