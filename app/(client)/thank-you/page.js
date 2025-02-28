"use client";

import ThankYouPage from "components/Client/Common/ThankYouPage";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const param = searchParams?.get("param");
  console.log(param);

  return (
    <div className="container px-4 my-6">
      <ThankYouPage />
    </div>
  );
}
