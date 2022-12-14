import { ActionIcon, Footer, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandGithub } from "@tabler/icons";

const AppFooter = () => {
  const bigScreen = useMediaQuery("(min-width: 768px)");

  return (
    <Footer height="auto" p={0} pt={2}>
      <Group position={bigScreen ? "right" : "center"} mr="lg" ml="lg">
        <Stack align="center" spacing={0}>
          <ActionIcon
            onClick={() => {
              open("https://github.com/arafathusayn/sondhi");
            }}
          >
            <IconBrandGithub />
          </ActionIcon>
          <Text variant="text" color="dimmed" size="xs">
            {""}
          </Text>
        </Stack>
      </Group>

      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }}></div>
    </Footer>
  );
};

export default AppFooter;
