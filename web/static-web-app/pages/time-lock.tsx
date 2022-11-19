import type { NextPage } from "next";
import Head from "next/head";
import { Button, Stack } from "@mantine/core";
import { IconClockPause, IconCloudLockOpen, IconHomeCog } from "@tabler/icons";
import { useState } from "react";
import AdminControlPanel from "../components/TLAdminControlPanel";
import TimeLockRecovery from "../components/TLRecovery";
import SimpleTimeLock from "../components/SimpleTimeLock";

export type SelectedMenu =
  | "SIMPLE_TIME_LOCK"
  | "ADMIN"
  | "RECOVERY"
  | undefined;

const TimeLock: NextPage = () => {
  const [selected, setSelected] = useState<SelectedMenu>();

  return (
    <Stack
      align="center"
      justify="center"
      style={{
        height: (!selected && "70%") || "unset",
      }}
      spacing={selected ? "xs" : "xl"}
    >
      <Head>
        <title>
          {`Time-Lock | ${
            process.env.NEXT_PUBLIC_SITE_NAME || "Live Shared Secret"
          }`}
        </title>
      </Head>

      {selected === "SIMPLE_TIME_LOCK" && (
        <SimpleTimeLock setSelected={setSelected} />
      )}

      {selected === "ADMIN" && <AdminControlPanel setSelected={setSelected} />}

      {selected === "RECOVERY" && (
        <TimeLockRecovery setSelected={setSelected} />
      )}

      {!selected && (
        <>
          <Button
            component="button"
            style={{ width: "85vw", maxWidth: "400px" }}
            variant="light"
            color="grape"
            size="md"
            leftIcon={<IconClockPause />}
            styles={{
              leftIcon: {
                position: "absolute",
                left: "10%",
              },
            }}
            onClick={() => {
              setSelected("SIMPLE_TIME_LOCK");
            }}
          >
            Simple Time-Lock
          </Button>

          <Button
            component="button"
            style={{ width: "85vw", maxWidth: "400px" }}
            variant="light"
            color="teal"
            size="md"
            leftIcon={<IconHomeCog />}
            styles={{
              leftIcon: {
                position: "absolute",
                left: "10%",
              },
            }}
            onClick={() => {
              setSelected("ADMIN");
            }}
          >
            Admin Control Panel
          </Button>

          <Button
            component="button"
            style={{ width: "85vw", maxWidth: "400px" }}
            variant="light"
            color="blue"
            size="md"
            leftIcon={<IconCloudLockOpen />}
            styles={{
              leftIcon: {
                position: "absolute",
                left: "10%",
              },
            }}
            onClick={() => {
              setSelected("RECOVERY");
            }}
          >
            Recovery Panel
          </Button>
        </>
      )}
    </Stack>
  );
};

export default TimeLock;
