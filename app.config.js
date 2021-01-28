/*
  This file contains the main configuration for the tutorial
*/

/* Content components */
import Welcome from './pages/guidance/welcome.mdx';
import PairStyles from './pages/guidance/pairstyles.mdx';
import Slabs from './pages/guidance/slabs.mdx';
import Walkthrough from './pages/guidance/walkthrough.mdx';
import FirstCalculation from './pages/guidance/firstcalculation.mdx';
import Relaxations from './pages/guidance/relaxations.mdx';
import Scaling from './pages/guidance/scaling.mdx';
import SurfaceA from './pages/guidance/001_surface.mdx';
import SurfaceB from './pages/guidance/111_surface.mdx';
import End from './pages/guidance/end.mdx';

export default {
  
  backendURL: "https://linux-01.cmd.hsu-hh.info/wetty", 

  title: "Atomistic Modelling with Empirical Potentials",
  greeting: "Welcome to Modelling with Empirical Potentials",
  description: "This lab will introduce you to modelling at atomisitic length scales using the empirical potential code LAMMPS.",
  module: "Computational Design of Surfaces and Interfaces",
  institution: "Helmut-Schmidt-University Hamburg",
  basePath: "/lab2",
  steps: [
    Welcome,
    PairStyles,
    Slabs,
    Walkthrough,
    FirstCalculation,
    Relaxations,
    Scaling,
    SurfaceA,
    SurfaceB,
    End
  ],
  videos: {
  }
}