import React, { useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

import mbway from "./logos/mbway.png";
import multibanco from "./logos/multibanco.png";
import banktransfer from "./logos/banktransfer.png";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

const IconImage = function (url) {
  return (
    <div>
      <img src={url} />
    </div>
  );
};

const Mbway = () => IconImage(mbway);
const Multibanco = () => IconImage(multibanco);
const BackTransfer = () => IconImage(banktransfer);

const fetchMbData = async (id) => {
  try {
    const response = await fetch(
      `https://api.adcvnm.pt/pending-payment/${id}/mb`
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

const postMbwayPayment = async (id, periods) => {
  console.log(periods);

  try {
    const response = await fetch(
      // `https://api.adcvnm.pt/pending-payment/${id}/mbway`,
      `http://api.club-manager.lh/pending-payment/${id}/mbway`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "mbway",
          periods,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export default function PaymentInfo({ periods, value, id }) {
  const [index, setIndex] = React.useState(0);
  const [mbReference, setMbReference] = useState(null);
  const [mbValue, setMbValue] = useState(null);
  const [mbLoading, setMbLoading] = useState(false);
  const [mbwayLoading, setMbwayLoading] = useState(false);
  const [mbError, setMbError] = useState(false);

  const generateMbReference = async () => {
    setMbLoading(true);

    fetchMbData(id)
      .then((data) => {
        const payment = data.payment;
        setMbReference(payment.method);
        setMbValue(data.total);
        setMbLoading(false);
      })
      .catch(() => {
        setMbLoading(false);
        setMbError(true);
      });
  };

  const generateMbwayPayment = async () => {
    setMbwayLoading(true);

    postMbwayPayment(id, periods)
      .then((data) => {
        console.log(data);
        /*const payment = data.payment;
        setMbReference(payment.method);
        setMbValue(data.total);*/
        setMbLoading(false);
      })
      .catch(() => {
        setMbLoading(false);
        // setMbError(true);
      });
  };

  return (
    <Box sx={{ width: 500 }}>
      <TabPanel value={index} index={0}>
        <Typography variant="h5" gutterBottom>
          Pagamento por MBWay
        </Typography>

        {mbwayLoading ? (
          <>
            <Typography gutterBottom>
              Aprove o pagamento na sua aplicação MBWay. A aguardar...
            </Typography>

            <CircularProgress color="primary" />
          </>
        ) : (
          <>
            <Typography gutterBottom>
              Pretende efetuar o pagamento por MWay? Clique abaixo. Irá receber
              no seu telefone o pedido de pagamento para aprovar
            </Typography>
            <Button variant="contained" onClick={generateMbwayPayment}>
              Pagar por MBWay
              {mbLoading ? <CircularProgress color="secondary" /> : null}
            </Button>
          </>
        )}
      </TabPanel>
      <TabPanel value={index} index={1}>
        <Typography variant="h5" gutterBottom>
          Pagamento por Multibanco
        </Typography>
        {mbReference ? (
          <Typography variant="h6" gutterBottom>
            <div>
              <b>Entidade:</b> {mbReference.entity}
            </div>
            <div>
              <b>Referência:</b> {mbReference.reference}
            </div>
            <div>
              <b>Valor:</b> {mbValue}€
            </div>
          </Typography>
        ) : (
          <>
            <Typography gutterBottom>
              Pretende efetuar o pagamento por Multibanco? Clique abaixo para
              gerar a referência:
            </Typography>
            <Button variant="contained" onClick={generateMbReference}>
              Gerar referência MB
              {mbLoading ? <CircularProgress color="secondary" /> : null}
            </Button>
          </>
        )}
        <Snackbar open={mbError} onClick={() => setMbError(false)}>
          <Alert severity="error">
            Ocorreu um erro ao gerar referência Multibanco. Por favor use outros
            métodos ou contacte a direção
          </Alert>
        </Snackbar>
      </TabPanel>
      <TabPanel value={index} index={2}>
        <Typography variant="h5" gutterBottom>
          Pagamento por Transferência Bancária
        </Typography>
        <Typography gutterBottom>
          Para efetuar o pagamento por Transferência Bancária, envie o valor
          para a conta com o IBAN PT50 0045 3270 4033312357662
        </Typography>
      </TabPanel>

      <Divider light />

      <BottomNavigation
        showLabels
        value={index}
        onChange={(_, newIndex) => setIndex(newIndex)}
      >
        <BottomNavigationAction
          icon={<Mbway />}
          style={index !== 0 ? { opacity: 0.5 } : {}}
        />
        <BottomNavigationAction
          icon={<Multibanco />}
          style={index !== 1 ? { opacity: 0.5 } : {}}
        />
        <BottomNavigationAction
          icon={<BackTransfer />}
          style={index !== 2 ? { opacity: 0.5 } : {}}
        />
      </BottomNavigation>
    </Box>
  );
}
