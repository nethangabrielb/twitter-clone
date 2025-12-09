"use client";

import useUser from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";

import Head from "next/head";
import { useParams } from "next/navigation";

import { User } from "@/types/user";

const Profile = () => {
  const params = useParams();
  const id = params.id;
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/users/${id}`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Error fetching from the server.");
      }
      const data = await res.json();
      return data.data as User;
    },
  });

  useEffect(() => {
    document.title = `${user?.name} (@${user?.username}) / Twitter Clone`;
  }, [user]);

  console.log(user);

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div>
        <div className="flex flex-col"></div>
      </div>
    </>
  );
};

export default Profile;
