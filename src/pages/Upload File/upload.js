import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import {
  uploadData,
  uploadExcelData,
  uploadPdfData,
} from "../../services/Service";

const FileUpload = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [data, setData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [resultFile, setResultFile] = useState([]);

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.match(/\.(xls|xlsx)$/)) {
      setExcelFile(file);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setExcelData(parsedData);
        console.log(parsedData);
        // sendExcelFileDataToBackend(parsedData);
      };
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select a valid Excel file with .xls or .xlsx extension.",
      });
      setExcelFile(null);
      event.target.value = null;
    }
  };

  // const sendExcelFileDataToBackend = async (excelData) => {
  //     const result = await uploadExcelData(excelData);
  //     if (result) {
  //     console.log(result);
  //     }
  // };

  const handlePdfFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file && file.name.toLowerCase().endsWith(".pdf")) {
      setPdfFile(file);
      const base64Data = await convertToBase64(file);
      // sendPdfDataToBackend(file.name, base64Data);
      setPdfData(base64Data);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select a valid PDF file with .pdf extension.",
      });
      setPdfFile(null);
      event.target.value = null;
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // const sendPdfDataToBackend = async (filename, base64Data) => {
  //     const result = await uploadPdfData(filename, base64Data);
  //     if (result) {
  //         console.log(result);
  //     }
  // };

  const handleProcessFiles = async (event) => {
    event.preventDefault();
    const processFiles = async () => {
      const result = await uploadData(excelData, pdfFile.name, pdfData);

      if (result) {
        console.log(result);
        setResultFile(result);

        // // Generate and download a new Excel file
        // const generateExcelFile = () => {
        //   const wb = XLSX.utils.book_new();
        //   const ws = XLSX.utils.json_to_sheet(result.excelData);
        //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        //   // Generate Excel file in the form of a Blob
        //   const excelBlob = XLSX.write(wb, {
        //     bookType: "blob",
        //     mimeType:
        //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //   });

        //   // Create a Blob URL and create a link element
        //   const url = window.URL.createObjectURL(excelBlob);
        //   const link = document.createElement("a");

        //   // Set the link attributes
        //   link.href = url;
        //   link.setAttribute("download", `${Date.now()}.xlsx`);

        //   // Append the link to the document body, trigger the click event, and remove the link
        //   document.body.appendChild(link);
        //   link.click();
        //   link.remove();

        //   // Release the Blob URL
        //   window.URL.revokeObjectURL(url);
        // };
        const generateExcelFile = (questions) => {
          const timestamp = new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .split(".")[0];
          const filename = `Outputfile_${timestamp}.xlsx`;

          const formattedQuestions = questions.map(
            (question) => `• ${question}`
          );

          const ws = XLSX.utils.aoa_to_sheet(
            formattedQuestions.map((question) => [question])
          );

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Questions");

          XLSX.writeFile(wb, filename);
        };

        generateExcelFile(result.excelData);
      }
    };
    processFiles();
  };
  // useEffect(() => {
  //     const fetchData = async () => {
  //         try{
  //             const response = await fetch(`http://localhost:9876/get-files`)
  //             if (!response.ok) {
  //                 throw new Error('Network Error')
  //             }

  //             const data = await response.json();
  //             console.log(data)
  //         } catch(error){
  //             console.error('Error')
  //         }
  //     }

  //     fetchData()
  // }, [])

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        File Upload Page
      </Typography>
      <form onSubmit={handleProcessFiles}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
          mt={4}
        >
          <Box mb={3}>
            <Typography variant="h6">1. Upload Excel File</Typography>
            <TextField
              type="file"
              accept=".xls, .xlsx"
              onChange={handleExcelFileChange}
              inputProps={{ multiple: false }}
            />
          </Box>
          <Box mb={3}>
            <Typography variant="h6">2. Upload PDF File</Typography>
            <TextField
              type="file"
              accept=".pdf"
              onChange={handlePdfFileChange}
              inputProps={{ multiple: false }}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button type="submit" variant="contained" color="primary">
            Process File
          </Button>
        </Box>
      </form>
      {resultFile && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Typography>Output</Typography>
          <div
            className="form-control"
            style={{
              backgroundColor: "#eff2f7",
              // height: '200px',
              // width: '400px'
            }}
          >
            <ol>{resultFile.excelData}</ol>
            <ol>
              {/* Render your result data here */}
              {resultFile.extractedText}
            </ol>
          </div>
        </Box>
      )}
    </Container>
  );
};

export default FileUpload;
