"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}

export default Page;
