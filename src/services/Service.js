export const uploadExcelData = async (excelData) => {
  try {
    const response = await fetch(`/api/upload_excel`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ excelData }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.log(response);
      console.error("Error uploading Excel data to the backend:");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const uploadPdfData = async (filename, base64Data) => {
  try {
    const response = await fetch(`http://localhost:9876/api/upload-pdf`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename, base64Data }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error uploading PDF data to the backend");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const uploadData = async (excelData, filename, base64Data) => {
  try {
    const response = await fetch(
      `http://localhost:9876/api/process_questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          excelData,
          filename,
          base64Data,
        }),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error sending files to the backend");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
