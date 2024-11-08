import {
  Card,
  Layout,
  Text,
  Button,
  TextField,
  ChoiceList,
  Checkbox,
  Badge,
  Page,
  InlineStack,
  BlockStack,
  InlineGrid,
  Tooltip,
  Icon
} from '@shopify/polaris';
import {
  InfoIcon
} from '@shopify/polaris-icons';
import { useState } from 'react';
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function AgeVerificationApp() {
  const [ageVerificationOn, setAgeVerificationOn] = useState(false);
  const [minimumAge, setMinimumAge] = useState('21');
  const [selectedPages, setSelectedPages] = useState(['all']);
  const [countryRestriction, setCountryRestriction] = useState(false);

  return (
    <Page
      fullWidth
      title='Age Verification'
      titleMetadata={<Badge>Off</Badge>}
      subtitle="Easily add age verification to your store. Check age with age gate popup on entry or before checkout."
      primaryAction={<Button variant="secondary">Preview</Button>}
    >
      
      {/* Main layout with 20% sidebar and 80% content */}
      <Layout.Section>
        <InlineGrid columns={['oneThird', 'twoThirds']}>
          {/* Sidebar for buttons - one third */}
          <div>
            <Card>
              <BlockStack gap='400'>
                <Button variant='tertiary' pressed>General Settings</Button>
                <Button variant='tertiary'>Content & Styles</Button>
              </BlockStack>
            </Card>
          </div>
          {/* Main content area with cards - two thirds */}
          <div>
          <BlockStack gap='800'>
          <Card>
            <Text as='h2' variant='headingMd'>
              General
            </Text><br/>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h3" variant="headingSm">
                    Turn on/off Age Verification for your store                
                  </Text>
                  <Text as="p" color="subdued">
                    By turning on, we will turn on the App Embed for your store.
                  </Text>
                </BlockStack>
                <Button size="slim" onClick={() => setAgeVerificationOn(!ageVerificationOn)}>
                  {ageVerificationOn ? 'Turn Off' : 'Turn On'}
                </Button>
              </InlineStack>
            </Card><br/>
            <TextField
              label="Default minimum allowed age"
              value={minimumAge}
              onChange={(value) => setMinimumAge(value)}
              type="number"
              suffix="Years old"
            />
          </Card>

          <Card>
            <InlineStack>
              <Text as='h2' variant='headingMd'>
                Set up pages to display the verification
              </Text>
              <Tooltip
                dismissOnMouseOut
                content="Use this option to control what specific pages to display the age verification."
              >
                <Icon
                  source={InfoIcon}
                  tone="base"
                />
              </Tooltip>
            </InlineStack><br/>
            <ChoiceList
              choices={[
                { label: 'All Pages', value: 'all' },
                { label: 'Only Selected Pages', value: 'selected' },
              ]}
              selected={selectedPages}
              onChange={(value) => setSelectedPages(value)}
            />
            <Text color="subdued">
              
            </Text>
          </Card>

          <Card>
            <InlineStack>
              <Text as='h2' variant='headingMd'>
                Set up restrictions by country
              </Text>
              <Tooltip
                dismissOnMouseOut
                content='If this option is turned on, then we will use the country-specific minimum age instead of the "Default minimum age".'
              >
                <Icon
                  source={InfoIcon}
                  tone="base"
                />
              </Tooltip>
            </InlineStack><br/>
            <Checkbox
              label="Restrict Age Verification to selected countries"
              checked={countryRestriction}
              onChange={() => setCountryRestriction(!countryRestriction)}
            />
          </Card>
          </BlockStack>
          </div>
        </InlineGrid>
      </Layout.Section>
    </Page>
  );
}
