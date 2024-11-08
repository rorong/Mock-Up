import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  Badge,
  InlineStack,
} from "@shopify/polaris";
import {
  SettingsIcon
} from '@shopify/polaris-icons';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  });
};

export default function Index() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  // const [ageVerification, setAgeVerification] = useState(false);
  // const [app2, setApp2] = useState(false);
  // const [app3, setApp3] = useState(false);

  return (
    <Page>
      <TitleBar title="Dashi Security Suite" />
      <Card>
        <Text as="h2" variant="headingMd">Security Apps Setup</Text><br/>
        
        <BlockStack spacing="4" gap='500'>
          
          {/* Age Verification Toggle */}
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                Age Verification{" "}
                <Badge>Off</Badge>
              </Text>
              <Text as="p" color="subdued">Easily add age verification to your store. Check age with age gate popup on entry or before checkout.</Text>
            </BlockStack>
            <Button size='large' icon={SettingsIcon} onClick={() => navigate('/app/ageVerificationApp')}/>
          </InlineStack>

          {/* App 2 Toggle */}
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                App 2{" "}
                <Badge>Off</Badge>  
              </Text>
              <Text as="p" color="subdued">Secondary content</Text>
            </BlockStack>
            <Button size='large' icon={SettingsIcon} onClick={() => console.log('App 2')}/>
          </InlineStack>

          {/* App 3 Toggle */}
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                App 3{" "}
                <Badge>Off</Badge>  
              </Text>
              <Text as="p" color="subdued">Secondary content</Text>
            </BlockStack>
            <Button size='large' icon={SettingsIcon} onClick={() => console.log('App 3')}/>
          </InlineStack>

        </BlockStack>
      </Card>
    </Page>
  );
}
