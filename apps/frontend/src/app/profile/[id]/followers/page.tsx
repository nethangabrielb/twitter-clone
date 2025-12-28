"use client";

import Head from "next/head";
import { useParams } from "next/navigation";

const FollowersIndex = () => {
  const params = useParams();

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[600px] h-full relative"></div>
    </>
  );
};

export default FollowersIndex;
