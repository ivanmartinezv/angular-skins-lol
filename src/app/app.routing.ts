import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
//import { HomeComponent } from "./home/home.component";

const appRoutes: Routes = [
  {
    path: "home",
    component: AppComponent //HomeComponent
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home" }
];

export const Routing = RouterModule.forRoot(appRoutes);
