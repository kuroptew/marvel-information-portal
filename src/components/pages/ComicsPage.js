import React from 'react';
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import { Route, Routes} from "react-router-dom"
import {SingleComicPage} from "./index";
import {Helmet} from "react-helmet";

const ComicsPage = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Page with list of our comics"
        />
        <title>Comics Page</title>
      </Helmet>
      <AppBanner/>
      <ComicsList/>
      <Routes>
        <Route path=":comicId" element={<SingleComicPage/>}/>
      </Routes>
    </>
  );
};

export default ComicsPage;