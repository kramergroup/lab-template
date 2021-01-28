/*
  This file contains the main configuration for the tutorial
*/

/* Content components */
import Welcome from './pages/guidance/welcome.mdx';


export default {
  
  backendURL: "https://linux-01.cmd.hsu-hh.info/wetty", 

  title: "Atomistic Modelling with Empirical Potentials",
  greeting: "Welcome to Modelling with Empirical Potentials",
  description: "This lab will introduce you to modelling at atomisitic length scales using the empirical potential code LAMMPS.",
  module: "Computational Design of Surfaces and Interfaces",
  institution: "Helmut-Schmidt-University Hamburg",
  basePath: "/lab2",
  steps: [
    Welcome
  ],
  videos: {
  }
}