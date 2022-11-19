import {
  Button,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { IconArrowBack, IconCopy, IconLock } from "@tabler/icons";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SelectedMenu } from "../../pages/time-lock";
import {
  DurationFormat,
  PageLinks,
  TimeLockServer,
  TimeLockServerInfoForShare,
} from "../../types";
import { createTimeLockKey, getTimeLockServers } from "../../utils/api";
import { aesGcmEncrypt } from "../../utils/cryptography";
import { encode as encodeBase64 } from "../../utils/encoding/base64";
import convertDurationToSeconds from "../../utils/time/duration-to-seconds";

type SimpleTimeLockProps = {
  setSelected: (menu?: SelectedMenu) => void;
};

const SimpleTimeLock = ({ setSelected }: SimpleTimeLockProps) => {
  const [secret, setSecret] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [timeLockDurationFormat, setTimeLockDurationFormat] =
    useState<DurationFormat>(DurationFormat.DAYS);
  const [timeLockDurationNumber, setTimeLockDurationNumber] =
    useState<number>();
  const defaultServerListProvider = "https://timelock.sondhi.app";
  const [providerUrl, _setProviderUrl] = useState(defaultServerListProvider);
  const [timeLockServersLoading, setTimeLockServersLoading] = useState(true);
  const [timeLockServers, setTimeLockServers] = useState<TimeLockServer[]>([]);
  const [timeLockOK, setTimeLockOK] = useState(false);
  const [encryptedTimeLockAdminInfo, setEncryptedTimeLockAdminInfo] =
    useState("");
  const [timeLockCreateKeyResults, setTimeLockCreateKeyResults] =
    useState<Awaited<ReturnType<typeof createTimeLockKey>>>();

  const tlServerListAPICalled = useRef(false);
  const timeLockInfo = useRef("");

  const fetchTimeLockServers = useCallback(async () => {
    if (!timeLockServersLoading || tlServerListAPICalled.current) {
      return;
    }

    tlServerListAPICalled.current = true;

    const servers = await getTimeLockServers({
      url: providerUrl,
      token: process.env.NEXT_PUBLIC_TIMELOCK_API_ACCESS_TOKEN || "",
      setErrorText,
    });

    if (servers instanceof Array) {
      setTimeLockServers(servers);
    }

    setTimeLockServersLoading(false);
  }, [providerUrl, timeLockServersLoading]);

  const sendKeyToTimeServers = useCallback(async () => {
    if (
      !secret ||
      !adminPassword ||
      !recoveryPassword ||
      !timeLockOK ||
      !timeLockDurationNumber ||
      !timeLockDurationFormat
    ) {
      return;
    }

    let encryptedPartialData = await aesGcmEncrypt({
      plaintext: secret,
      password: recoveryPassword,
    });

    const iv = encryptedPartialData.slice(0, 24);

    encryptedPartialData = encryptedPartialData.slice(24);

    if (!timeLockDurationNumber) {
      throw new Error(`Duration in ${timeLockDurationFormat} is not set`);
    }

    const results = await createTimeLockKey({
      timeLockServers,
      adminPassword,
      recoveryPassword,
      iv,
      encryptedPartialData,
      lockDurationInSeconds: convertDurationToSeconds({
        amount: timeLockDurationNumber,
        format: timeLockDurationFormat,
      }),
      setErrorText,
    });

    if (results instanceof Array) {
      setTimeLockCreateKeyResults(results);

      const tlServerInfo = {
        results,
        iv,
      } as TimeLockServerInfoForShare;

      const cipherText = await aesGcmEncrypt({
        plaintext: JSON.stringify(tlServerInfo),
        password: adminPassword,
      });

      timeLockInfo.current = encodeBase64(JSON.stringify(tlServerInfo));

      setEncryptedTimeLockAdminInfo(cipherText);
    }
  }, [
    secret,
    adminPassword,
    recoveryPassword,
    timeLockDurationFormat,
    timeLockDurationNumber,
    timeLockOK,
    timeLockServers,
  ]);

  useEffect(() => {
    if (
      secret &&
      secret.length > 0 &&
      adminPassword &&
      adminPassword.length > 0 &&
      recoveryPassword &&
      recoveryPassword.length > 0 &&
      timeLockDurationNumber &&
      timeLockDurationNumber > 0 &&
      timeLockDurationFormat &&
      timeLockDurationFormat.length > 0
    ) {
      setTimeLockOK(true);
    } else {
      setTimeLockOK(false);
    }
  }, [
    secret,
    adminPassword,
    recoveryPassword,
    timeLockDurationFormat,
    timeLockDurationNumber,
  ]);

  useEffect(() => {
    fetchTimeLockServers();
  }, [fetchTimeLockServers]);

  return (
    <>
      <Button
        component="button"
        style={{ width: "85vw", maxWidth: "400px" }}
        mb="xl"
        variant="light"
        color="blue"
        size="md"
        leftIcon={<IconArrowBack />}
        styles={{
          leftIcon: {
            position: "absolute",
            left: "10%",
          },
        }}
        onClick={() => {
          setSelected(undefined);
        }}
      >
        Back
      </Button>

      <Text
        weight="bold"
        size="xs"
        style={{ width: "85vw", maxWidth: "400px" }}
      >{`Warning: it's not recommended to use Time-Lock without Shamir's Secret Sharing! This page exists for demo purposes only. The encrypted cipher text of your secret, the initialization vector (iv), your admin password and recovery password are sent to the time-lock server from this page so the time-lock server can decrypt your secret!`}</Text>

      <Text
        weight="bold"
        size="xs"
        style={{ width: "85vw", maxWidth: "400px" }}
      >
        {`Please use `}
        <Link href={PageLinks.CreateShares} passHref>
          <Text component="a" color="blue">
            {" "}
            Create Shares{" "}
          </Text>
        </Link>
        {` feature for your sensitive secrets.`}
      </Text>

      {!timeLockCreateKeyResults && (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              sendKeyToTimeServers().catch((e) => {
                setErrorText(e.message || e);
              });
            }}
          >
            <PasswordInput
              maxLength={63}
              style={{ width: "85vw", maxWidth: "400px" }}
              mb="xl"
              placeholder="Enter your secret text"
              label="The Secret"
              required
              value={secret}
              onChange={(event) => {
                setSecret(event.currentTarget.value);
              }}
              onFocus={(event) => {
                event.currentTarget.select();
              }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <PasswordInput
              icon={<IconLock size={16} color="skyblue" />}
              style={{ width: "85vw", maxWidth: "400px" }}
              placeholder="Enter your admin password"
              label="New Admin Password"
              required
              value={adminPassword}
              onChange={(event) => {
                setAdminPassword(event.currentTarget.value?.trim());
              }}
            />

            <PasswordInput
              mt="xl"
              icon={<IconLock size={16} color="skyblue" />}
              style={{ width: "85vw", maxWidth: "400px" }}
              placeholder="Enter your recovery password"
              label="New Recovery Password"
              required
              value={recoveryPassword}
              onChange={(event) => {
                setRecoveryPassword(event.currentTarget.value?.trim());
              }}
            />

            <Stack style={{ width: "85vw", maxWidth: "400px" }} mt="xl">
              <Text size="sm" align="left">
                Lock Duration:
              </Text>

              <Group position="center" grow>
                <NumberInput
                  placeholder={`Enter ${timeLockDurationFormat}`}
                  size="sm"
                  type="number"
                  autoComplete="off"
                  autoCorrect="off"
                  value={timeLockDurationNumber}
                  onChange={(value) => {
                    if (value && value > 0) {
                      setTimeLockDurationNumber(value);
                    }
                  }}
                  min={1}
                  required
                ></NumberInput>

                <Select
                  label=""
                  placeholder="Pick one"
                  data={[
                    { value: DurationFormat.YEARS, label: "Years" },
                    { value: DurationFormat.MONTHS, label: "Months" },
                    { value: DurationFormat.DAYS, label: "Days" },
                    { value: DurationFormat.HOURS, label: "Hours" },
                    { value: DurationFormat.MINUTES, label: "Minutes" },
                  ]}
                  value={timeLockDurationFormat}
                  onChange={(value) =>
                    value && setTimeLockDurationFormat(value as DurationFormat)
                  }
                  size="sm"
                  styles={{
                    root: {
                      width: "50px",
                    },
                  }}
                  dropdownPosition="top"
                  required
                />
              </Group>

              <Button
                type="submit"
                style={{ width: "85vw", maxWidth: "400px" }}
                mb="xl"
                mt="xl"
                variant="gradient"
                gradient={{ from: "darkblue", to: "purple" }}
                size="md"
                disabled={!timeLockOK}
              >
                Next
              </Button>
            </Stack>
          </form>
        </>
      )}

      {timeLockCreateKeyResults &&
        timeLockCreateKeyResults.filter((x) => x).length > 0 && (
          <Stack spacing={0}>
            <Textarea
              minRows={2}
              style={{ width: "85vw", maxWidth: "400px" }}
              styles={{ input: { maxHeight: "20vh", height: "80px" } }}
              label={`Time-Lock Admin Information`}
              mb="lg"
              value={encryptedTimeLockAdminInfo}
              onFocus={(event) => event.currentTarget.select()}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={() => {}}
              required
            />

            <Button
              mt={0}
              component="button"
              style={{ width: "85vw", maxWidth: "400px" }}
              variant="light"
              color="teal"
              size="md"
              leftIcon={<IconCopy />}
              styles={{
                leftIcon: {
                  position: "absolute",
                  left: "5%",
                },
              }}
              onClick={async (event) => {
                event.preventDefault();

                await navigator.clipboard.writeText(encryptedTimeLockAdminInfo);

                alert(`Copied Admin Info`);
              }}
            >
              Copy Time-Lock Admin Info
            </Button>

            <Textarea
              mt="xl"
              mb="lg"
              minRows={2}
              styles={{
                input: {
                  maxHeight: "20vh",
                  height: "80px",
                },
              }}
              placeholder="Time-Lock Server Info"
              label="Time-Lock Server Info"
              required
              value={timeLockInfo.current}
              onChange={(_event) => {}}
              onFocus={(event) => event.currentTarget.select()}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <Button
              mt={0}
              component="button"
              style={{ width: "85vw", maxWidth: "400px" }}
              variant="light"
              color="teal"
              size="md"
              leftIcon={<IconCopy />}
              styles={{
                leftIcon: {
                  position: "absolute",
                  left: "5%",
                },
              }}
              onClick={async (event) => {
                event.preventDefault();

                await navigator.clipboard.writeText(timeLockInfo.current);

                alert(`Copied Time-Lock Server Info`);
              }}
            >
              Copy Time-Lock Server Info
            </Button>
          </Stack>
        )}

      <Modal
        opened={!!errorText}
        onClose={() => {
          setErrorText("");
        }}
        title="Error!"
        centered={true}
      >
        {errorText}
      </Modal>
    </>
  );
};

export default SimpleTimeLock;
