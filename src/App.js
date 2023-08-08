import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import adcvnmLogo from "./logos/adcvnm.png";

import "./App.css";
import PeriodsTable from "./PeriodsTable.js";
import PaymentInfo from "./PaymentInfo.js";

function App() {
  const [memberInfo, setMemberInfo] = useState(null);
  const [pendingPeriods, setPendingPeriods] = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [invalidLink, setInvalidLink] = useState(false);

  const [expandedPeriods, setExpandedPeriods] = useState(false);
  const [expandedPaymentData, setExpandedPaymentData] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  const fetchUserData = async (id) => {
    try {
      // const response = await fetch(`https://api.adcvnm.pt/pending-info/${id}`);
      const response = await fetch(`http://api.club-manager.lh/pending-info/${id}`);
// a1d0c6e83f027327d8461063f4ac58a6
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      if (response.status === 200) {
        setInvalidLink(false);
        return response.json();
      }
    } catch (error) {
      setInvalidLink(true);
    }
  };

  useEffect(() => {
    //if (!id) return;

    if (!id) {
      const data = {
        member: {
          name: "Joaquim Ferreira Neves",
          msisdn: "+351914782150",
          email: null,
        },
        pendingPeriods: [
          {
            name: "Época 2022/23",
            start: {
              date: "2022-07-01 03:07:50.000000",
              timezone_type: 3,
              timezone: "UTC",
            },
            end: {
              date: "2023-07-15 03:07:50.000000",
              timezone_type: 3,
              timezone: "UTC",
            },
            value: 20,
          },
        ],
      };

      setMemberInfo(data.member);
      setPendingPeriods(data.pendingPeriods);
      setPendingTotal(
        data.pendingPeriods.reduce((prev, curr) => prev + curr.value, 0)
      );

      return;
    }

    fetchUserData(id).then((data) => {
      if (!data) return;

      setMemberInfo(data.member);
      setPendingPeriods(data.pendingPeriods);
      setPendingTotal(
        data.pendingPeriods.reduce((prev, curr) => prev + curr.value, 0)
      );
    });
  }, [id]);

  return invalidLink ? (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h3">Ups...</Typography>
      <Typography variant="h5">
        O link não é válido ou ocorreu um erro. Se tiveres dificuldades
        contacta-nos pelo geral@adcvnm.pt
      </Typography>
    </div>
  ) : (
    <div className="App">
      <div className="logo">
        <img src={adcvnmLogo} />
      </div>
      <div>
        <Typography variant="h4">Olá {memberInfo?.name}</Typography>
      </div>
      <div style={{ marginTop: "8px" }}>
        <Typography align="center">
          Obrigado por regularizares as tuas quotas. É o primeiro passo para
          ajudar a nossa Associação a cumprir com a sua missão!
        </Typography>
      </div>

      {pendingPeriods.length ? (
        <div className="accordion-wrapper">
          <Accordion
            expanded={expandedPeriods}
            onChange={() =>
              expandedPeriods
                ? setExpandedPeriods(false)
                : setExpandedPeriods(true)
            }
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Table
                sx={{ minWidth: 350, maxWidth: 500 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow
                    key="totals"
                    className="total"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">TOTAL</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="right">{pendingTotal}€</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionSummary>
            <AccordionDetails>
              <PeriodsTable periods={pendingPeriods}></PeriodsTable>
            </AccordionDetails>
          </Accordion>
          <Accordion
            className="payment-data-header"
            expanded={expandedPaymentData}
            onChange={() =>
              expandedPaymentData
                ? setExpandedPaymentData(false)
                : setExpandedPaymentData(true)
            }
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
            >
              <Typography>
                {expandedPaymentData ? null : "Dados para pagamento"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <PaymentInfo periods={pendingPeriods} value={pendingTotal} id={id}></PaymentInfo>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ) : (
        <Card sx={{ minWidth: 275, marginTop: "32px" }}>
          <CardContent>
            <Typography sx={{ fontSize: 18 }}>
              As tuas quotas estão em dia!
              <br />
              OBRIGADO!
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
