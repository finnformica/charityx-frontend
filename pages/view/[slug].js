import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

import BigTitle from "../../components/Titles/BigTitle";
import SmallTitle from "../../components/Titles/SmallTitle";
import PillButton from "../../components/PillButton/PillButton";
import StateChip from "../../components/StateChip/StateChip";

import CauseTrust from "../../components/CauseTrust/CauseTrust";

import contractInfo from "../../constants/contractInfo";
import { ethers } from "ethers";
import AdminDrawer from "../../components/AdminDrawer/AdminDrawer";

const instantiateContract = (address, abi) => {
  const url = "http://localhost:8545";
  const provider = new ethers.providers.JsonRpcProvider(url);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  return contract;
};

const donate = async (address, amount) => {
  try {
    const { ethereum } = window;

    if (ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        address,
        contractInfo.contract_abi,
        signer
      );

      const tx = await contract.donate({
        value: ethers.utils.parseEther("1"),
        gasLimit: 3000000,
      });

      console.log(tx);
    } else {
      console.log("Ethereum object not found");
    }
  } catch (e) {
    console.log(e);
  }
};

const CausePage = ({ cause }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  // display loading if page is not generated yet
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  // check if user is admin of cause
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const fetchAccounts = async () => {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length == 0) {
          setAdmin(false);
          return;
        }

        setAdmin(accounts[0].toLowerCase() == cause.admin.toLowerCase());
      };

      fetchAccounts().catch((e) => console.log(e));

      window.ethereum.on("accountsChanged", function (accounts) {
        fetchAccounts().catch((e) => console.log(e));
      });
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box>
            <Box>
              <SmallTitle>Cause</SmallTitle>
              <StateChip
                cause={cause}
                color={cause.causeState == 1 ? "#61EF61" : "#E10600"}
              />
              {admin ? <AdminDrawer /> : <></>}
            </Box>
            <BigTitle fontSize={48}>{cause.title}</BigTitle>
            <Typography fontSize={14} sx={{ pt: 1 }}>
              {cause.desc}
            </Typography>
          </Box>

          <Image
            src={cause.image_url}
            layout="responsive"
            alt="Cause Image"
            width={500}
            height={300}
            style={{
              objectFit: "cover",
              borderRadius: 4,
              marginTop: 16,
              maxWidth: "500px",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <PillButton
            variant="contained"
            {...(cause.causeState == 1 ? {} : { disabled: true })}
            onClick={() => donate(cause.address, 2)}
          >
            Donate
          </PillButton>
          {cause.email ? (
            <PillButton variant="outlined" href={`mailto:${cause.email}`}>
              Contact
            </PillButton>
          ) : (
            <></>
          )}
        </Box>
        <CauseTrust />
      </Box>
    </Container>
  );
};

export const getStaticPaths = async () => {
  const contract = instantiateContract(
    contractInfo.factory_address,
    contractInfo.factory_abi
  );

  const res = await contract.functions.cfRetrieveIds();

  const paths = res[0].map((id) => ({
    params: { slug: id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const contract = instantiateContract(
    contractInfo.factory_address,
    contractInfo.factory_abi
  );
  try {
    const res = await contract.functions.cfRetrieveInfo(params.slug);
    const causeInfo = res[0];

    const cause = {
      id: causeInfo["id"],
      title: causeInfo["name"],
      admin: causeInfo["admin"],
      address: causeInfo["contractAddress"],
      incoming: causeInfo["incoming"],
      outgoing: causeInfo["outgoing"],
      causeTotal: ethers.utils.formatEther(
        parseInt(causeInfo["causeTotal"]._hex).toString()
      ),
      causeState: parseInt(causeInfo["causeState"]._hex).toString(),
      email: causeInfo["email"],
      desc: causeInfo["description"],
      website: causeInfo["website"],
      image_url: causeInfo["thumbnail"],
    };

    return {
      props: {
        cause,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default CausePage;
