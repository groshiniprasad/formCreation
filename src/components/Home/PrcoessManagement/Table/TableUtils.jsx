import * as XLSX from "xlsx";

export const handleExportFullTable = (data, setExcelData, setIsExcelModalOpen) => {
  let mergeRanges = [];
  let rows = [];
  let rowStart = 1; // Track row numbers for merging

  data.forEach((item) => {
    const maxRows = Math.max(
      item.failureMode.length || 1,
      item.effects.length || 1,
      item.causes.length || 1,
      item.controls.length || 1,
      item.actions.length || 1
    );

    for (let i = 0; i < maxRows; i++) {
      rows.push([
        i === 0 ? item.process : "", // Merge Process Step
        item.failureMode[i] || "",
        item.effects[i] || "",
        item.causes[i] || "",
        item.controls[i] ? `${item.controls[i].type}: ${item.controls[i].value}` : "",
        item.actions[i] || "",
      ]);
    }

    if (maxRows > 1) {
      mergeRanges.push([rowStart + 1, rowStart + maxRows]); // Track merged cell ranges
    }
    rowStart += maxRows;
  });

  setExcelData(rows);
  setIsExcelModalOpen(true); // Open Modal with Data Preview
};

export const downloadExcelFile = (excelData, setIsExcelModalOpen) => {
  if (!excelData.length) return;

  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Process", "Failure Mode", "Effects", "Causes", "Controls", "Actions"], // Headers
    ...excelData,
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Process Data");

  // Generate Excel file
  XLSX.writeFile(workbook, "Process_Failure_Analysis.xlsx");
  setIsExcelModalOpen(false); // Close modal after download
};
