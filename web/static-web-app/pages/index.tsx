import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Accordion, Button, List, Stack, Text, ThemeIcon } from "@mantine/core";
import { PageLinks } from "../types";
import {
  IconChartPie,
  IconCheck,
  IconClockPause,
  IconDoorEnter,
  IconHomeHeart,
} from "@tabler/icons";
import { siteName } from "../constants";

const Home: NextPage = () => {
  return (
    <Stack align="center" justify="center" spacing="xl" mb="xl">
      <Head>
        <title>{`${siteName}`}</title>
      </Head>

      <Link href={PageLinks.CreateShares} passHref>
        <Button
          mt="xl"
          component="a"
          style={{ width: "80vw", maxWidth: "400px" }}
          variant="light"
          color="violet"
          size="md"
          leftIcon={<IconChartPie />}
          styles={{
            leftIcon: {
              position: "absolute",
              left: "10%",
            },
          }}
        >
          Create Shares
        </Button>
      </Link>

      <Link href={PageLinks.CreateRoom} passHref>
        <Button
          component="a"
          style={{ width: "80vw", maxWidth: "400px" }}
          variant="light"
          color="indigo"
          size="md"
          leftIcon={<IconHomeHeart />}
          styles={{
            leftIcon: {
              position: "absolute",
              left: "10%",
            },
          }}
        >
          Create Room
        </Button>
      </Link>

      <Link href={PageLinks.EnterRoom} passHref>
        <Button
          component="a"
          style={{ width: "80vw", maxWidth: "400px" }}
          variant="light"
          color="grape"
          size="md"
          leftIcon={<IconDoorEnter />}
          styles={{
            leftIcon: {
              position: "absolute",
              left: "10%",
            },
          }}
        >
          Enter Room
        </Button>
      </Link>

      <Link href={PageLinks.TimeLock} passHref>
        <Button
          component="a"
          style={{ width: "80vw", maxWidth: "400px" }}
          variant="light"
          color="cyan"
          size="md"
          leftIcon={<IconClockPause />}
          styles={{
            leftIcon: {
              position: "absolute",
              left: "10%",
            },
          }}
        >
          Time-Lock
        </Button>
      </Link>

      <Accordion
        style={{ width: "80vw", maxWidth: "400px" }}
        defaultValue="what"
        styles={{
          content: {
            padding: "0px",
          },
        }}
        pb="xl"
        mb="xl"
      >
        <Accordion.Item value="what" style={{ borderBottom: 0 }}>
          <Accordion.Control style={{ padding: "0px", paddingBottom: "5px" }}>
            <Text size="md">What is {siteName}?</Text>
          </Accordion.Control>
          <Accordion.Panel
            styles={{
              root: {
                margin: "0px",
              },
            }}
          >
            <Text size="sm">{`${
              process.env.NEXT_PUBLIC_SITE_NAME || "Live Shared Secret"
            } is a collection of tools that enables you
            to protect and securely share your secrets using Shamir's Secret Sharing scheme
            and an optional time-lock mechanism.`}</Text>

            <Link href="https://youtu.be/ojMFCpUt7OU?t=262" target="_blank">
              <Text size="sm" color="blue" mt="sm">
                {`Watch the full explanation of Shamir's Secret Sharing and its implementation details on YouTube`}
              </Text>
            </Link>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="timelockhow" style={{ borderBottom: 0 }}>
          <Accordion.Control style={{ padding: "0px", paddingBottom: "5px" }}>
            <Text size="md" mt="sm">
              How does the Time-Lock work?
            </Text>
          </Accordion.Control>
          <Accordion.Panel
            styles={{
              root: {
                margin: "0px",
              },
            }}
            pb="xl"
          >
            <Text size="sm" mt="sm">
              {`You'll provide two passwords:`}
            </Text>

            <List type="unordered" size="xs" spacing={0}>
              <List.Item pt="xs" pb={0} mb={0}>
                <Text size="sm">{`Admin Password`}</Text>
              </List.Item>
              <List.Item pt={0} mt={0}>
                <Text size="sm">{`Recovery Password`}</Text>
              </List.Item>
            </List>

            <Text size="sm" mt="sm">
              {`The app will encrypt your admin password with your recovery password. The encrypted text of your admin password will be sent to the time-lock providers who will keep it locked for the time duration you mention.`}
            </Text>

            <Text size="sm" mt="sm">
              {`You may split your recovery password into multiple shares using Shamir's secret sharing scheme. When the minimum shares are combined, the recovery password can be retrieved.`}
            </Text>

            <Text size="sm" mt="sm">
              {`This recovery password can be used to request the unlock to the time-lock server. After the request is made, the time-lock server will wait until the lock duration is reached and then it will unlock and send the encrypted admin password back.`}
            </Text>

            <Text size="sm" mt="sm">
              {`Using this process, you may merge your admin password and recovery password to encrypt and time-lock your other secrets.`}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="features" style={{ borderBottom: 0 }} pb="xl">
          <Accordion.Control style={{ padding: "0px", paddingBottom: "5px" }}>
            <Text size="md" mt="sm">
              What are the features?
            </Text>
          </Accordion.Control>
          <Accordion.Panel
            styles={{
              root: {
                margin: "0px",
              },
            }}
            pb="xl"
          >
            <List
              mt="md"
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={16} radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text size="xs">
                  Share secrets that require multiple persons.
                </Text>
              </List.Item>
              <List.Item>
                <Text size="xs">No single point of failure.</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Have multiple backups of your secrets.</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">{"Restore the secret after one's death."}</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">
                  Lock your secrets for a certain amount of time.
                </Text>
              </List.Item>
              <List.Item>
                <Text size="xs">
                  Create and use passwords for joint-accounts.
                </Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Use a password without anyone knowing it.</Text>
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default Home;
