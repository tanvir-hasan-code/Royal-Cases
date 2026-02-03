import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import ErrorPage from "../pages/Error/ErrorPage";
import AddCases from "../components/Cases/AddCases/AddCases";
import AllCases from "../components/Cases/AllCases/AllCases";
import RunningCases from "../components/Cases/RunningCases/RunningCases";
import CourtSetup from "../components/MasterSetup/CourtSetup/CourtSetup";
import CaseTypeSetup from "../components/MasterSetup/CaseTypeSetup/CaseTypeSetup";
import PoliceStationSetup from "../components/MasterSetup/PoliceStationSetup/PoliceStationSetup";
import CompanySetup from "../components/MasterSetup/CompanySetup/CompanySetup";
import Dashboard from "../Dashboard/Dashboard";
import DailyNotes from "../components/DailyNotes/DailyNotes";
import UserManagement from "../components/UserManagement/UserManagement";
import Login from "../pages/Auth/Login/Login";
import SignUp from "../pages/Auth/SignUp/SignUp";
import TodaysCases from "../components/Cases/TodaysCases/TodaysCases";
import TomorrowCases from "../components/Cases/TomorrowCases/TomorrowCases";
import CompleteCases from "../components/Cases/CompleteCases/CompleteCases";
import PendingCases from "../components/Cases/PendingCases/PendingCases";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        Component: Dashboard,
      },
      {
        path: "/notes",
        Component: DailyNotes,
      },
      {
        path: "/cases/add",
        Component: AddCases,
      },
      {
        path: "/cases/all",
        Component: AllCases,
      },
      {
        path: "/cases/running",
        Component: RunningCases,
      },
      {
        path: "/cases/today",
        Component: TodaysCases,
      },
      {
        path: "/cases/tomorrow",
        Component: TomorrowCases,
      },
      {
        path: "/cases/completed",
        Component: CompleteCases,
      },
      {
        path: "/cases/pending",
        Component: PendingCases,
      },
      {
        path: "/setup/court",
        Component: CourtSetup,
      },
      {
        path: "/setup/case-type",
        Component: CaseTypeSetup,
      },
      {
        path: "/setup/police-station",
        Component: PoliceStationSetup,
      },
      {
        path: "/setup/company",
        Component: CompanySetup,
      },
      {
        path: "/user-management",
        Component: UserManagement,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
]);
