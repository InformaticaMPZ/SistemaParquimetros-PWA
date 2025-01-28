import useParkingMetersStore from "@/store/useParkingMeters.store";
import { Page } from "components/General/Page";
import { Garage } from "components/Pages/garaje/Garage";
import React from "react";

export default async function GarajePage() {
  const { getStartSession, getActive } = useParkingMetersStore();
  let isActive = await getActive();
  if (isActive.data.Value === "false") {
  }
  return (
    <>
      <Page>
        <Garage/>
      </Page>
    </>
  );
}
