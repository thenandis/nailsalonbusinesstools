// English translations
import React from 'react';

// English translations
const en = {
  // Common App Elements
  common: {
    // Header and Navigation
    appTitle: "🏪 Nail Salon Business Tools",
    w2vs1099Tab: "W2 vs 1099 Model",
    breakEvenTab: "Break Even Model", 
    budgetToolTab: "Other Costs and Revenue",
    
    // Language Selector     
    language: "Language",
    english: "English",
    vietnamese: "Tiếng Việt",
    
    // Common UI Elements
    save: "Save",
    load: "Load",
    export: "Export",
    saveData: "Save Data",
    loadData: "Load Data",
    exportData: "Export Data",
    resetToDefaults: "Reset to Defaults",
    resetConfirmMessage: "Are you sure you want to reset to default values? This will remove all your custom changes. Inside original!!!",
    changesAutomaticallySaved: "Changes are automatically saved to your browser",
    noDataToExport: "No data to export",
    notSet: "Not Set",

    // Operating Cost Calculator
    operatingCostCalculator: "🏢 Operating Cost Calculator",
    manageCostCategories: "Manage Cost Categories",
    enterCostCategoryPlaceholder: "Enter cost category (e.g., Software, Training)",
    addCategory: "Add Category",
    pleaseEnterCostCategory: "Please enter a cost category name",
    totalAnnualOperatingCosts: "Total Annual Operating Costs:",
    removeCostItem: "Remove",

    // Revenue Streams
    revenueStreamsPricingStrategy: "💵 Revenue Streams & Pricing Strategy", 
    manageServices: "Manage Services",
    enterServiceNamePlaceholder: "Enter service name (e.g., French Manicure)",
    addService: "Add Service",
    pleaseEnterServiceName: "Please enter a service name",
    service: "Service",
    price: "Price ($)",
    servicesPerWeek: "Services/Week", 
    weeklyRevenue: "Weekly Revenue ($)",
    estimatedAnnualRevenue: "Estimated Annual Revenue:",
    comparePricesAdvice: "Compare your prices to local averages and your break-even price per service. Adjust as needed for profitability and competitiveness.",
    totalWeeklyRevenue: "Total Weekly Revenue:",
    action: "Action",
    
    // Save/Load UI Elements
    show: "Show",
    hide: "Hide", 
    delete: "Delete",
    saved: "Saved:",
    savedScenarios: "Saved Scenarios",
    savedDataSets: "Saved Data Sets",
    exportInstructionsScenarios: "Click Export to download scenario data as CSV file",
    exportInstructions: "Click Export to download data set as CSV file",
    unknownDate: "Unknown Date",
    pleaseEnterName: "Please enter a scenario name",
    allDataSavedSuccessfully: "All data saved successfully!",
    dataLoadedSuccessfully: "Data loaded successfully!",
    dataDeletedSuccessfully: "Data deleted successfully!",
    exportAllToExcel: "Export All to Excel",
    
    // Common Field Labels
    monthly: "Monthly",
    weekly: "Weekly",
    hourly: "Hourly", 
    commission: "Commission",
    monthlyFrequency: "Monthly",
    annualFrequency: "Annual",
    annualCost: "Annual Cost",
    
    // Payment Model Options
    commissionBased: "Commission Based",
    noCommissionHourlyWageBoothRental: "No Commission / Hourly Wage / Booth Rental",
    
    // Footer
    contactInformation: "Contact Information",
    ourMission: "Our Mission", 
    followUs: "Follow Us",
    privacyPolicy: "Privacy Policy",
    help: "Help",
    donate: "DONATE",
    copyright: "© 2025 CHNSC. All rights reserved.",
    appBuiltBy: "App built by Bankers without Borders volunteers"
  },

  // W2 vs 1099 Model Page
  w2vs1099: {
    title: "⚖️ W2 vs 1099 Employment Model Analysis",
    description: "***DISCLAIMER - This Model provides general assessment of business conditions. Modeled results are not guaranteed.*** Compare four different employment models for nail salon technicians. Based on California labor laws, tax requirements, and industry standards. Includes comprehensive cost analysis for both employee and employer perspectives.",
    summaryComparison: "📊 Summary Comparison",
    fourModelComparison: "📊 Four Employment Model Comparison",
    businessParameters: "📝 Business Parameters",
    
    // Business Parameters
    avgServicesPerShift: "Avg Services per 8-hour Shift:",
    avgPricePerService: "Avg Price per Service:",
    technicianShare: "Technician Share:",
    avgSuppliesCostPerService: "Avg Supplies Cost/Service:",
    avgServiceTipPercent: "Avg Tip Percentage:",
    avgW2HourlyWage: "Avg W2 Hourly Wage:",
    avgHoursPerWeek: "Avg Hours per Week:",
    hoursPerWeek: "Hours per Week:",
    employeeInsurance: "Employee Insurance:",
    salonAmenities: "Salon Amenities (coffee, etc.):",
    annualSuppliesCost: "Annual Supplies Cost:",
    monthlyRentPerTech: "Monthly Rent per Technician:",
    
    // Employment Models
    commissionW2Employee: "1) Commission W2 Employee",
    commission1099Contractor: "3) Commission 1099 Contractor",
    independentContractor: "4) Independent Contractor (Booth Rental)",
    noCommissionW2Employee: "2) No Commission W2 Employee",
    
    // Employment Models - Split versions for line breaks
    commissionW2EmployeeSplit: "1) Commission W2<br />Employee",
    commission1099ContractorSplit: "3) Commission 1099<br />Contractor",
    independentContractorSplit: "4) Independent Contractor<br />(Booth Rental)",
    noCommissionW2EmployeeSplit: "2) No Commission W2<br />Employee",
    
    // Financial Calculations
    employeeIncome: "Employee Income:",
    contractorIncome: "Contractor Income:",
    employeeTaxesAndBenefits: "Employee Taxes & Benefits:",
    employeeTaxesAndExpenses: "Employee Taxes and Expenses:",
    contractorTaxesAndExpenses: "Contractor Taxes and Expenses:",
    socialSecurity: "Social Security",
    medicare: "Medicare",
    liabilityInsurance: "Liability Insurance",
    totalTaxBurden: "Total Tax Burden",
    employeeNetTakeHome: "Employee Net Take-home:",
    contractorNetTakeHome: "Contractor Net Take Home:",
    employerBurden: "Employer Burden",
    
    // Employer Expenses Section
    employerExpensesFromBudgetTool: "💰 Employer Expenses (from Budget Tool)",
    monthlySupplementalCosts: "Monthly Supplemental Costs:",
    monthlyOperatingCosts: "Monthly Operating Costs:",
    monthlyEmployerExpenses: "Employer Expenses:",
    employeePayrollTaxes: "Employee Payroll Taxes",
    employerPayrollTaxes: "Employer Payroll Taxes (Mandatory):",
    
    // Key Insights
    keyInsights: "Key Insights",
    
    // Legal Disclaimer
    importantLegalDisclaimer: "⚖️ Important Legal Disclaimer",
    legalDisclaimer: "⚖️ Important Legal Disclaimer",
    legalDisclaimerText: "This tool provides estimates only. Always consult with employment attorneys, tax professionals, and HR specialists before implementing any employment classification model. California labor laws are complex and change frequently.",
    taxScheduleVerification: "Tax Schedule Verification:",
    taxScheduleVerificationText: "Always confirm current tax rates and schedules on IRS.gov and California Employment Development Department (EDD) websites.",
    misclassificationPenalties: "Misclassification Penalties:",
    misclassificationPenaltiesText: "Incorrectly classifying employees as 1099 contractors can result in significant penalties, back taxes, and legal liability.",
    professionalAdviceRequired: "Professional Advice Required:",
    professionalAdviceRequiredText: "Consult with employment attorneys, tax professionals, and HR specialists before implementing any employment classification model.",
    
    // Table Headers
    model: "Model",
    employeeNetAnnual: "Employee Net Annual",
    employeeNetHourly: "Employee Net Hourly",
    employerExpenses: "Employer Expenses",
    employerCost: "Employer Cost",
    employerProfit: "Employer Profit",
    
    // Save/Load
    saveLoadTitle: "Save/Load W2 vs 1099 Data",
    saveLoadPlaceholder: "Enter scenario name",
    saveButtonText: "Save W2 vs 1099 Model Data"
  ,
  // Section Toggles & Buttons
  resetToDefault: "Reset to Default",
  collapseAllLabel: "📁 Collapse All",
  expandAllLabel: "📂 Expand All",
  collapseAllSections: "Collapse all sections",
  expandAllSections: "Expand all sections",
  analysisConfiguration: "Analysis Configuration",
  analysisTimeFrame: "Analysis Time Frame",
  monthlyAnalysis: "Monthly Analysis",
  weeklyAnalysis: "Weekly Analysis",
  timeFrameDescription: "Choose your preferred time frame for break-even analysis calculations.",
  businessModelConfiguration: "Business Model Configuration",
  operationalEfficiencyParameters: "Operational Efficiency Parameters"
  // Tooltips (add as needed)
  ,socialSecurityTooltip: "Social Security Rate (Employer Portion): The employer's contribution to Social Security. For 2025, the rate is 6.2% on wages up to $176,100. This matches the employee's contribution, totaling 12.4% combined.",
  medicareTooltip: "Medicare Rate (Employer Portion): The employer's contribution to Medicare. For 2025, the rate is 1.45% on all wages with no cap. This matches the employee's contribution, totaling 2.9% combined."
  // Add more tooltips as needed
  },

  // Break Even Model Page
  breakEven: {
    title: "📈 Strategic Break-Even Analysis",
    description: "Multi-scenario operational efficiency modeling with comprehensive business analysis.",
    
    // Selection Options
    timeFrameSelection: "Time Frame",
    businessModelSelection: "Business Model",
    wageModel: "Wage Model:",
    employmentType: "Employment Type:",
    w2Employee: "W2 Employee",
    contractor1099: "1099 Contractor",
    
    // Operational Efficiency
    operationalEfficiency: "Operational Efficiency",
    operationalEfficiencyAnalysis: "Operational Efficiency Analysis",
    numberOfTechnicians: "Number of Technicians:",
    operationHoursPerDay: "Operation Hours per Day:",
    daysOpenPerMonth: "Days Open per Month:",
    daysOpenPerWeek: "Days Open/Week:",
    appointmentsPerTechPerDay: "Appointments per Tech/Day:",
    appointmentsPerTechPerDayField: "Appointments per Tech/Day:",
    avgAppointmentDuration: "Avg Appointment Duration:",
    targetUtilizationRate: "Target Utilization Rate (%):",
    targetUtilizationRateField: "Target Utilization Rate:",
    
    // Pricing Parameters
    technicianSharePercent: "Technician Share %:",
    avgServiceTipPercent: "Avg Service Tip %:",
    hourlyWageField: "Hourly Wage ($):",
    hoursPerWeekField: "Hours per Week:",
    
    // Analysis Sections
    multiScenarioAnalysis: "Multi-Scenario Analysis",
    
    // Results and Analysis Labels
    calculationPeriod: "Calculation Period:",
    weekly: "Weekly",
    monthly: "Monthly",
    weeklyConvertedToMonthly: "Weekly (converted to monthly)",
    totalAvailableHours: "Total Available Hours",
    actualHoursBooked: "Actual Hours Booked",
    currentUtilizationRate: "Current Utilization Rate:",
    appointments: "Appointments",
    monthlyAppointmentsForAnalysis: "Current Monthly Appointments:",
    
    // Break-Even Analysis Section
    breakEvenAnalysis: "Break-Even Analysis",
    laborCostPerAppointment: "Labor Cost/Appointment:",
    totalVariableCostPerAppt: "Total Variable Cost/Appt:",
    contributionMarginPerAppt: "Contribution Margin/Appt:",
    breakEvenAppointments: "Break-Even Appointments:",
    
    // Profit & Margin Analysis Section
    profitMarginAnalysis: "Profit & Margin Analysis",
    totalMonthlyRevenue: "Total Monthly Revenue:",
    totalMonthlyExpenses: "Total Monthly Expenses:",
    
    // Fixed Costs Labels
    totalFixedCostsMonth: "Total Fixed Costs/Month",
    
    // Save/Load Section
    saveLoadTitle: "Save/Load Break-Even Data",
    saveLoadPlaceholder: "Enter scenario name",
    saveButtonText: "Save Break-Even Model Data",
    
    // Strategic Sections
    strategicUtilizationGuidance: "Strategic Utilization Guidance & Efficiency Metrics",
    pricingStrategyRecommendations: "💡 💰 Pricing & Cost Strategy",
    
    // Legal Disclaimer
    legalDisclaimer: "⚖️ Important Legal Disclaimer",
    financialProjections: "Financial Projections:",
    financialProjectionsText: "All calculations are estimates based on provided inputs. Actual results may vary due to market conditions, seasonal factors, and operational changes.",
    businessModelValidation: "Business Model Validation:",
    businessModelValidationText: "These projections should be validated against actual business performance data and local market conditions.",
    professionalAdviceRequired: "Professional Advice Required:",
    professionalAdviceRequiredText: "Consult with financial advisors, accountants, and business consultants before making major business decisions based on these projections."
  },

  // Budget Tool Page
  budgetTool: {
    title: "💰 Comprehensive Budget Planning Tool",
    description: "Complete budgeting and financial planning tool for nail salon operations with comprehensive cost analysis.",
    
    // Main Tabs
    employeeCosts: "Employee Costs",
    supplementalCosts: "Supplemental Costs", 
    operatingCosts: "Operating Costs",
    revenueStreams: "Revenue Streams",
    breakEvenAnalysis: "Break Even Analysis",
    
    // Employee Cost Calculator
    employee: {
      calculator: "👥 Employee Cost Calculator",
      basicEmployeeInformation: "Basic Employee Information",
      servicePricingParameters: "Service & Pricing Parameters",
      operationalParameters: "Operational Parameters",
      employeeType: "Employee Type:",
      numberOfTechnicians: "Number of Technicians:",
      operationHoursPerDay: "Operation Hours per Day:",
      technicianSharePercent: "Technician Share %:",
      avgServiceTipPercent: "Avg Service Tip %:",
      hourlyWageField: "Hourly Wage ($):",
      hoursPerWeekField: "Hours per Week:",
      daysOpenPerMonth: "Days Open per Month:",
      appointmentsPerTechPerDay: "Appointments per Tech/Day:",
      targetUtilizationRate: "Target Utilization Rate (%):"
    },
    
    // Supplemental Cost Calculator
    supplemental: {
      calculator: "📋 Supplemental Cost Calculator",
      manageSupplementalCosts: "Manage Supplemental Costs",
      enterCostItemPlaceholder: "Enter cost item (e.g., Marketing, Training)",
      addCostItem: "Add Cost Item",
      removeCostItem: "Remove",
      totalAnnualSupplementalCosts: "Total Annual Supplemental Costs:",
      pleaseEnterCostItem: "Please enter a cost item name",
      monthlyFrequency: "Monthly",
      annualFrequency: "Annual",
      annualCost: "Annual Cost"
    },
    
    // Operating Cost Calculator
    operating: {
      calculator: "🏢 Operating Cost Calculator",
      manageCostCategories: "Manage Cost Categories",
      enterCostCategoryPlaceholder: "Enter cost category (e.g., Software, Training)",
      addCategory: "Add Category",
      pleaseEnterCostCategory: "Please enter a cost category name",
      totalAnnualOperatingCosts: "Total Annual Operating Costs:"
    },
    
    // Revenue Stream Calculator
    revenue: {
      calculator: "💵 Revenue Stream Calculator",
      revenueStreamsPricingStrategy: "Revenue Streams & Pricing Strategy",
      manageServices: "Manage Services",
      enterServiceNamePlaceholder: "Enter service name (e.g., French Manicure)",
      addService: "Add Service",
      pleaseEnterServiceName: "Please enter a service name",
      service: "Service",
      price: "Price ($)",
      servicesPerWeek: "Services/Week",
      weeklyRevenue: "Weekly Revenue ($)",
      estimatedAnnualRevenue: "Estimated Annual Revenue:",
      comparePricesAdvice: "Compare your prices to local averages and your break-even price per service. Adjust as needed for profitability and competitiveness.",
      totalWeeklyRevenue: "Total Weekly Revenue:"
    },
    
    // Break Even Analysis
    analysis: {
      calculator: "⚖️ Break Even Analysis Calculator",
      calculatedFromBudgetToolData: "Calculated from Budget Tool Data",
      autoCalculatedDescription: "All values below are automatically calculated from data entered in the Employee, Supplemental, Operating, and Revenue tabs.",
  totalAnnualCosts: "Total Annual Costs:",
  totalAnnualRevenue: "Total Annual Revenue:",
      servicesPerWeek: "Services per Week:",
      averageServicePrice: "Average Service Price:",
      employeeType: "Employee Type:",
      notSet: "Not Set",
      
      // Section Titles
      resultsTitle: "Break-Even Analysis Results",
      operationalEfficiencyTitle: "Operational Efficiency Analysis",
      
      // Employee Model Information
      employeeModel: "Employee Model:",
      basicCalculation: "Basic Calculation:",
      basicCalculationDesc: "Simple hourly wage with standard employer burden",
      serviceBasedCalculation: "Service-Based Calculation:",
      serviceBasedCalculationDesc: "Employment cost analysis with service parameters",
      breakEvenModel: "Break-Even Model:",
      breakEvenModelDesc: "Operational efficiency-based calculation",
      comprehensiveModel: "Comprehensive Model:",
      comprehensiveModelDesc: "Operational efficiency-based calculation with full service parameters",
      
      // Labels for employee model details
      baseAnnualWage: "Base Annual Wage:",
      employerBurden: "Employer Burden (25%):",
      baseWage: "Base Wage:",
      servicesPerShift: "Services per Shift:",
      pricePerService: "Price per Service:",
      technicianShare: "Technician Share:",
      fica: "FICA (7.65%):",
      workersComp: "Workers Comp (2%):",
      additionalCosts: "Additional costs (insurance, supplies, rent) included from Supplemental/Operating tabs",
      technicians: "Technicians:",
      hoursPerDay: "Hours/Day:",
      daysPerMonth: "Days/Month:",
      appointmentsPerTechPerDay: "Appointments/Tech/Day:",
      wageModel: "Wage Model:",
      commissionRate: "Commission Rate:",
      operationalParameters: "Operational Parameters:",
      wageStructure: "Wage Structure:",
      serviceParameters: "Service Parameters:",
      additionalOverheadCosts: "Additional overhead costs included from Supplemental and Operating Cost tabs",
      
      // Results Section
      breakEvenAnalysisResults: "Break-Even Analysis Results",
      breakEvenPricePerService: "Break Even Price per Service:",
      currentAveragePrice: "Current average price:",
      aboveBreakEven: "Above break-even",
      belowBreakEven: "Below break-even",
      annualRevenueNeeded: "Annual Revenue Needed:",
      currentAnnualRevenue: "Current annual revenue:",
      profitable: "Profitable",
      operatingAtLoss: "Operating at a loss",
      servicesPerYear: "Services per Year:",
      basedOnServices: "Based on {count} services per week × 52 weeks",
      adjustPricingAdvice: "Adjust your pricing or service volume to achieve profitability",
      totalAnnualCostsCovered: "Total annual costs that must be covered:",
      
      // Operational Efficiency Analysis  
      operationalEfficiencyAnalysis: "Operational Efficiency Analysis",
      operationalMetrics: "Operational Metrics",
      totalAvailableHoursMonth: "Total Available Hours/Month:",
      appointmentsMonth: "Appointments/Month:",
      hoursBookedMonth: "Hours Booked/Month:",
      utilizationRate: "Utilization Rate:",
      financialPerformance: "Financial Performance",
      monthlyRevenue: "Monthly Revenue:",
      monthlyCosts: "Monthly Costs:",
      netProfit: "Net Profit:",
      netMargin: "Net Margin:",
      breakEvenMetrics: "Break-Even Metrics",
      costPerAppointment: "Cost per Appointment:",
      avgServicePrice: "Avg Service Price:",
      contributionMargin: "Contribution Margin:",
      breakEvenAppointments: "Break-Even Appointments:",
      performanceInsights: "Performance Insights",
      
      // Performance insights messages
      lowUtilization: "Low Utilization:",
      lowUtilizationAdvice: "Consider reducing technician count or increasing marketing to book more appointments.",
      moderateUtilization: "Moderate Utilization:",
      moderateUtilizationAdvice: "Good foundation - optimize scheduling and pricing to improve profitability.",
      highUtilization: "High Utilization:",
      highUtilizationAdvice: "Excellent efficiency! Consider expanding capacity or premium pricing.",
      operatingLoss: "Operating at Loss:",
      operatingLossAdvice: "Increase prices per service or reduce costs.",
      breakEvenOperation: "Break-Even Operation:",
      breakEvenOperationAdvice: "Focus on cost optimization and premium service offerings.",
      profitableOperation: "Profitable Operation:",
      profitableOperationAdvice: "Strong performance! Consider reinvesting in growth or quality improvements."
    },
    
    // Legal Disclaimer
    legalDisclaimer: "⚖️ Important Legal Disclaimer",
    budgetEstimates: "Budget Estimates:",
    budgetEstimatesText: "All calculations are estimates for planning purposes. Actual costs and revenues may vary based on market conditions, operational efficiency, and business decisions.",
    dataAccuracy: "Data Accuracy:",
    dataAccuracyText: "The accuracy of these projections depends on the quality and completeness of input data. Regular review and updates are recommended.",
    professionalAdviceRequired: "Professional Advice Required:",
    professionalAdviceRequiredText: "Consult with financial advisors, accountants, and business consultants before making major financial commitments or business decisions."
  }
};

// Vietnamese translations
const vi = {
  // Common App Elements  
  common: {
    // Header and Navigation
    appTitle: "🏪 Công Cụ Kinh Doanh Nail Salon",
    w2vs1099Tab: "Mô Hình W2 vs 1099",
    breakEvenTab: "Mô Hình Hòa Vốn",
    budgetToolTab: "Chi Phí Khác và Doanh Thu",
    
    // Language Selector
    language: "Ngôn Ngữ",
    english: "English",
    vietnamese: "Tiếng Việt",
    
    // Common UI Elements
    save: "Lưu",
    load: "Tải",
    export: "Xuất",
    saveData: "Lưu Dữ Liệu",
    loadData: "Tải Dữ Liệu", 
    exportData: "Xuất Dữ Liệu",
    resetToDefaults: "Đặt Lại Mặc Định",
    resetConfirmMessage: "Bạn có chắc chắn muốn đặt lại về giá trị mặc định? Điều này sẽ xóa tất cả các thay đổi của bạn.",
    changesAutomaticallySaved: "Các thay đổi được tự động lưu trong trình duyệt",
    noDataToExport: "Không có dữ liệu để xuất",
    notSet: "Chưa Đặt",

    // Operating Cost Calculator
    operatingCostCalculator: "🏢 Máy Tính Chi Phí Hoạt Động",
    manageCostCategories: "Quản Lý Danh Mục Chi Phí",
    enterCostCategoryPlaceholder: "Nhập danh mục chi phí (ví dụ: Phần mềm, Đào tạo)",
    addCategory: "Thêm Danh Mục",
    pleaseEnterCostCategory: "Vui lòng nhập tên danh mục chi phí",
    totalAnnualOperatingCosts: "Tổng Chi Phí Hoạt Động Hàng Năm:",
    removeCostItem: "Xóa",

    // Revenue Streams
    revenueStreamsPricingStrategy: "💵 Nguồn Doanh Thu & Chiến Lược Định Giá", 
    manageServices: "Quản Lý Dịch Vụ",
    enterServiceNamePlaceholder: "Nhập tên dịch vụ (ví dụ: Nail French)",
    addService: "Thêm Dịch Vụ",
    pleaseEnterServiceName: "Vui lòng nhập tên dịch vụ",
    service: "Dịch Vụ",
    price: "Giá ($)",
    servicesPerWeek: "Dịch Vụ/Tuần", 
    weeklyRevenue: "Doanh Thu Tuần ($)",
    estimatedAnnualRevenue: "Doanh Thu Hàng Năm Ước Tính:",
    comparePricesAdvice: "So sánh giá của bạn với mức giá trung bình địa phương và giá hòa vốn cho mỗi dịch vụ. Điều chỉnh theo nhu cầu về lợi nhuận và khả năng cạnh tranh.",
    totalWeeklyRevenue: "Tổng Doanh Thu Tuần:",
    action: "Hành Động",
    
    // Save/Load UI Elements
    show: "Hiện",
    hide: "Ẩn", 
    delete: "Xóa",
    saved: "Đã Lưu:",
    savedScenarios: "Kịch Bản Đã Lưu",
    savedDataSets: "Bộ Dữ Liệu Đã Lưu",
    exportInstructionsScenarios: "Nhấp Xuất để tải dữ liệu kịch bản dưới dạng tệp CSV",
    exportInstructions: "Nhấp Xuất để tải bộ dữ liệu dưới dạng tệp CSV",
    unknownDate: "Ngày Không Xác Định",
    pleaseEnterName: "Vui lòng nhập tên kịch bản",
    allDataSavedSuccessfully: "Tất cả dữ liệu đã được lưu thành công!",
    dataLoadedSuccessfully: "Dữ liệu đã được tải thành công!",
    dataDeletedSuccessfully: "Dữ liệu đã được xóa thành công!",
    exportAllToExcel: "Xuất Tất Cả Ra Excel",
    
    // Common Field Labels
    monthly: "Hàng Tháng",
    weekly: "Hàng Tuần",
    hourly: "Theo Giờ", 
    commission: "Hoa Hồng",
    monthlyFrequency: "Hàng Tháng",
    annualFrequency: "Hàng Năm",
    annualCost: "Chi Phí Hàng Năm",
    
    // Payment Model Options
    commissionBased: "Dựa Trên Hoa Hồng",
    noCommissionHourlyWageBoothRental: "Không Hoa Hồng / Lương Theo Giờ / Thuê Gian Hàng",
    
    // Footer
    contactInformation: "Thông Tin Liên Hệ",
    ourMission: "Sứ Mệnh Của Chúng Tôi",
    followUs: "Theo Dõi Chúng Tôi", 
    privacyPolicy: "Chính Sách Bảo Mật",
    help: "Trợ Giúp",
    donate: "QUYÊN GÓP",
    copyright: "© 2025 CHNSC. Tất cả quyền được bảo lưu.",
    appBuiltBy: "Ứng dụng được xây dựng bởi tình nguyện viên Bankers without Borders"
  },

  // W2 vs 1099 Model Page
  w2vs1099: {
    title: "⚖️ Phân Tích Mô Hình Tuyển Dụng W2 vs 1099",
    description: "So sánh bốn mô hình tuyển dụng khác nhau cho kỹ thuật viên nail salon. Dựa trên luật lao động California, yêu cầu thuế và tiêu chuẩn ngành. Bao gồm phân tích chi phí toàn diện cho cả quan điểm nhân viên và chủ lao động.",
    summaryComparison: "📊 So Sánh Tóm Tắt",
    fourModelComparison: "📊 So Sánh Bốn Mô Hình Tuyển Dụng",
    
    // Business Parameters
    avgServicesPerShift: "Trung Bình Dịch Vụ/Ca 8 Tiếng:",
    avgPricePerService: "Giá Trung Bình/Dịch Vụ:",
    technicianShare: "Phần Trăm Kỹ Thuật Viên:",
    avgSuppliesCostPerService: "Chi Phí Vật Liệu TB/Dịch Vụ:",
    avgServiceTipPercent: "Phần Trăm Tip Trung Bình:",
    avgW2HourlyWage: "Lương Theo Giờ W2 TB:",
    avgHoursPerWeek: "Giờ Làm TB/Tuần:",
    hoursPerWeek: "Giờ Làm Mỗi Tuần:",
    employeeInsurance: "Bảo Hiểm Nhân Viên:",
    salonAmenities: "Tiện Nghi Salon (cà phê, v.v.):",
    annualSuppliesCost: "Chi Phí Vật Liệu Hàng Năm:",
    monthlyRentPerTech: "Tiền Thuê Hàng Tháng/Kỹ Thuật Viên:",
    
    // Employment Models
    commissionW2Employee: "1) Nhân Viên W2 Hoa Hồng",
    commission1099Contractor: "3) Nhà Thầu 1099 Hoa Hồng",
    independentContractor: "4) Nhà Thầu Độc Lập (Thuê Gian Hàng)",
    noCommissionW2Employee: "2) Nhân Viên W2 Không Hoa Hồng",
    
    // Employment Models - Split versions for line breaks
    commissionW2EmployeeSplit: "1) Nhân Viên W2<br />Hoa Hồng",
    commission1099ContractorSplit: "3) Nhà Thầu 1099<br />Hoa Hồng",
    independentContractorSplit: "4) Nhà Thầu Độc Lập<br />(Thuê Gian Hàng)",
    noCommissionW2EmployeeSplit: "2) Nhân Viên W2<br />Không Hoa Hồng",
    
    // Financial Calculations
    employeeIncome: "Thu Nhập Nhân Viên:",
    contractorIncome: "Thu Nhập Nhà Thầu:",
    employeeTaxesAndBenefits: "Thuế & Phúc Lợi Nhân Viên:",
    employeeTaxesAndExpenses: "Thuế và Chi Phí Nhân Viên:",
    contractorTaxesAndExpenses: "Thuế và Chi Phí Nhà Thầu:",
    socialSecurity: "An Sinh Xã Hội",
    medicare: "Medicare",
    liabilityInsurance: "Bảo Hiểm Trách Nhiệm",
    totalTaxBurden: "Tổng Gánh Nặng Thuế",
    employeeNetTakeHome: "Thu Nhập Ròng Nhân Viên:",
    contractorNetTakeHome: "Thu Nhập Ròng Nhà Thầu:",
    employerBurden: "Gánh Nặng Chủ Lao Động",
    
    // Employer Expenses Section
    employerExpensesFromBudgetTool: "💰 Chi Phí Chủ Lao Động (từ Công Cụ Ngân Sách)",
    monthlySupplementalCosts: "Chi Phí Bổ Sung Hàng Tháng:",
    monthlyOperatingCosts: "Chi Phí Vận Hành Hàng Tháng:",
    monthlyEmployerExpenses: "Chi Phí Chủ Lao Động Hàng Tháng:",
    employeePayrollTaxes: "Thuế Bảng Lương Nhân Viên:",
    employerPayrollTaxes: "Thuế bảng lương chủ doanh nghiệp (Bắt buộc):",
    
    // Key Insights
    keyInsights: "Thông Tin Quan Trọng",
    
    // Legal Disclaimer
    importantLegalDisclaimer: "⚖️ Tuyên Bố Pháp Lý Quan Trọng",
    legalDisclaimer: "⚖️ Tuyên Bố Pháp Lý Quan Trọng", 
    legalDisclaimerText: "Công cụ này chỉ cung cấp ước tính. Luôn tham khảo ý kiến của luật sư lao động, chuyên gia thuế và chuyên gia HR trước khi thực hiện bất kỳ mô hình phân loại tuyển dụng nào. Luật lao động California rất phức tạp và thay đổi thường xuyên.",
    taxScheduleVerification: "Xác Minh Lịch Thuế:",
    taxScheduleVerificationText: "Luôn xác nhận thuế suất và lịch thuế hiện tại trên các trang web IRS.gov và Sở Phát Triển Việc Làm California (EDD).",
    misclassificationPenalties: "Hình Phạt Phân Loại Sai:",
    misclassificationPenaltiesText: "Phân loại sai nhân viên thành nhà thầu 1099 có thể dẫn đến các khoản phạt đáng kể, thuế truy thu và trách nhiệm pháp lý.",
    professionalAdviceRequired: "Cần Tư Vấn Chuyên Gia:",
    professionalAdviceRequiredText: "Tham khảo ý kiến luật sư lao động, chuyên gia thuế và chuyên viên nhân sự trước khi thực hiện bất kỳ mô hình phân loại việc làm nào.",
    
    // Table Headers
    model: "Mô Hình",
    employeeNetAnnual: "Thu Nhập Ròng Hàng Năm",
    employeeNetHourly: "Thu Nhập Ròng Theo Giờ", 
    employerExpenses: "Chi Phí Chủ Lao Động",
    employerCost: "Chi Phí Chủ Lao Động",
    employerProfit: "Lợi Nhuận Chủ Lao Động",
    
    // Save/Load
    saveLoadTitle: "Lưu/Tải Dữ Liệu W2 vs 1099",
    saveLoadPlaceholder: "Nhập tên kịch bản",
    saveButtonText: "Lưu Dữ Liệu Mô Hình W2 vs 1099"
  ,
  // Section Toggles & Buttons
  resetToDefault: "Đặt lại mặc định",
  collapseAllLabel: "📁 Thu gọn tất cả",
  expandAllLabel: "📂 Mở rộng tất cả",
  collapseAllSections: "Thu gọn tất cả các mục",
  expandAllSections: "Mở rộng tất cả các mục",
  analysisConfiguration: "Cấu Hình Phân Tích",
  analysisTimeFrame: "Khung Thời Gian Phân Tích",
  monthlyAnalysis: "Phân Tích Hàng Tháng",
  weeklyAnalysis: "Phân Tích Hàng Tuần",
  timeFrameDescription: "Chọn khung thời gian bạn muốn cho các phép tính hòa vốn.",
  businessModelConfiguration: "Cấu Hình Mô Hình Kinh Doanh",
  operationalEfficiencyParameters: "Thông Số Hiệu Quả Vận Hành"
  // Tooltips (add as needed)
  ,socialSecurityTooltip: "Tỷ lệ An Sinh Xã Hội (phần của chủ lao động): Phần đóng góp của chủ lao động cho An Sinh Xã Hội. Năm 2025, tỷ lệ là 6.2% trên lương đến $176,100. Chủ lao động và nhân viên cùng đóng góp, tổng cộng 12.4%.",
  medicareTooltip: "Tỷ lệ Medicare (phần của chủ lao động): Phần đóng góp của chủ lao động cho Medicare. Năm 2025, tỷ lệ là 1.45% trên toàn bộ lương, không giới hạn. Chủ lao động và nhân viên cùng đóng góp, tổng cộng 2.9%."
  // Add more tooltips as needed
  },

  // Break Even Model Page
  breakEven: {
    title: "📈 Phân Tích Hòa Vốn Chiến Lược",
    description: "Mô hình hiệu quả vận hành đa kịch bản với phân tích kinh doanh toàn diện.",
    
    // Selection Options
    timeFrameSelection: "Khung Thời Gian",
    businessModelSelection: "Mô Hình Kinh Doanh",
    wageModel: "Mô Hình Lương:",
    employmentType: "Loại Tuyển Dụng:",
    w2Employee: "Nhân Viên W2",
    contractor1099: "Nhà Thầu 1099",
    
    // Operational Efficiency
    operationalEfficiency: "Hiệu Quả Vận Hành",
    operationalEfficiencyAnalysis: "Phân Tích Hiệu Quả Vận Hành",
    numberOfTechnicians: "Số Lượng Kỹ Thuật Viên:",
    operationHoursPerDay: "Giờ Hoạt Động Mỗi Ngày:",
    daysOpenPerMonth: "Ngày Mở Cửa Mỗi Tháng:",
    daysOpenPerWeek: "Ngày Mở Cửa/Tuần:",
    appointmentsPerTechPerDay: "Lịch Hẹn/Kỹ Thuật Viên/Ngày:",
    appointmentsPerTechPerDayField: "Lịch Hẹn/Kỹ Thuật Viên/Ngày:",
    avgAppointmentDuration: "Thời Gian Trung Bình Mỗi Lịch Hẹn:",
    targetUtilizationRate: "Tỷ Lệ Sử Dụng Mục Tiêu (%):",
    targetUtilizationRateField: "Tỷ Lệ Sử Dụng Mục Tiêu:",
    
    // Multi-Scenario Analysis
    multiScenarioAnalysis: "Phân Tích Đa Kịch Bản",
    
    // Pricing Parameters
    technicianSharePercent: "% Chia Sẻ Kỹ Thuật Viên:",
    avgServiceTipPercent: "% Tiền Tip Trung Bình:",
    hourlyWageField: "Lương Theo Giờ ($):",
    hoursPerWeekField: "Giờ Làm Mỗi Tuần:",
    
    // Results and Analysis Labels
    calculationPeriod: "Chu Kỳ Tính Toán:",
    weekly: "Hàng Tuần",
    monthly: "Hàng Tháng",
    weeklyConvertedToMonthly: "Hàng Tuần (chuyển đổi thành hàng tháng)",
    totalAvailableHours: "Tổng Giờ Có Sẵn",
    actualHoursBooked: "Giờ Thực Tế Đã Đặt",
    currentUtilizationRate: "Tỷ Lệ Sử Dụng Hiện Tại:",
    appointments: "Lịch Hẹn",
    monthlyAppointmentsForAnalysis: "hiện tại Lịch Hẹn Hàng Tháng (để phân tích):",
    
    // Break-Even Analysis Section
    breakEvenAnalysis: "Phân Tích Hòa Vốn",
    laborCostPerAppointment: "Chi Phí Lao Động/Lịch Hẹn:",
    totalVariableCostPerAppt: "Tổng Chi Phí Biến Đổi/Lịch Hẹn:",
    contributionMarginPerAppt: "Lợi Nhuận Đóng Góp/Lịch Hẹn:",
    breakEvenAppointments: "Lịch Hẹn Hòa Vốn:",
    
    // Profit & Margin Analysis Section
    profitMarginAnalysis: "Phân Tích Lợi Nhuận & Tỷ Suất",
    totalMonthlyRevenue: "Tổng Doanh Thu Hàng Tháng:",
    totalMonthlyExpenses: "Tổng Chi Phí Hàng Tháng:",
    
    // Fixed Costs Labels
    totalFixedCostsMonth: "Tổng Chi Phí Cố Định/Tháng",
    
    // Save/Load Section
    saveLoadTitle: "Lưu/Tải Dữ Liệu Hòa Vốn",
    saveLoadPlaceholder: "Nhập tên kịch bản",
    saveButtonText: "Lưu Dữ Liệu Mô Hình Hòa Vốn",
    
    // Strategic Sections
    strategicUtilizationGuidance: "Hướng Dẫn Sử Dụng Chiến Lược & Chỉ Số Hiệu Quả",
    pricingStrategyRecommendations: "💡 💰 Chiến Lược Giá & Chi Phí",
    
    // Legal Disclaimer
    legalDisclaimer: "⚖️ Tuyên Bố Pháp Lý Quan Trọng",
    financialProjections: "Dự Báo Tài Chính:",
    financialProjectionsText: "Tất cả các tính toán đều là ước tính dựa trên dữ liệu đầu vào được cung cấp. Kết quả thực tế có thể khác nhau do điều kiện thị trường, yếu tố theo mùa và các thay đổi trong hoạt động.",
    businessModelValidation: "Xác Thực Mô Hình Kinh Doanh:",
    businessModelValidationText: "Những dự báo này nên được xác thực so với dữ liệu hiệu suất kinh doanh thực tế và điều kiện thị trường địa phương.",
    professionalAdviceRequired: "Cần Tư Vấn Chuyên Gia:",
    professionalAdviceRequiredText: "Tham khảo ý kiến của các cố vấn tài chính, kế toán và tư vấn kinh doanh trước khi đưa ra các quyết định kinh doanh quan trọng dựa trên các dự báo này."
  },

  // Budget Tool Page
  budgetTool: {
    title: "💰 Công Cụ Lập Kế Hoạch Ngân Sách Toàn Diện",
    description: "Công cụ lập ngân sách và kế hoạch tài chính hoàn chỉnh cho hoạt động nail salon với phân tích chi phí toàn diện.",
    
    // Main Tabs
    employeeCosts: "Chi Phí Nhân Viên",
    supplementalCosts: "Chi Phí Bổ Sung",
    operatingCosts: "Chi Phí Vận Hành",
    revenueStreams: "Nguồn Doanh Thu",
    breakEvenAnalysis: "Phân Tích Hòa Vốn",
    
    // Employee Cost Calculator
    employee: {
      calculator: "👥 Máy Tính Chi Phí Nhân Viên",
      basicEmployeeInformation: "Thông Tin Nhân Viên Cơ Bản",
      servicePricingParameters: "Thông Số Dịch Vụ & Định Giá",
      operationalParameters: "Thông Số Vận Hành",
      employeeType: "Loại Nhân Viên:",
      numberOfTechnicians: "Số Lượng Kỹ Thuật Viên:",
      operationHoursPerDay: "Giờ Hoạt Động Mỗi Ngày:",
      technicianSharePercent: "% Chia Sẻ Kỹ Thuật Viên:",
      avgServiceTipPercent: "% Tiền Tip Trung Bình:",
      hourlyWageField: "Lương Theo Giờ ($):",
      hoursPerWeekField: "Giờ Làm Mỗi Tuần:",
      daysOpenPerMonth: "Ngày Mở Cửa Mỗi Tháng:",
      appointmentsPerTechPerDay: "Lịch Hẹn/Kỹ Thuật Viên/Ngày:",
      targetUtilizationRate: "Tỷ Lệ Sử Dụng Mục Tiêu (%):"
    },
    
    // Supplemental Cost Calculator
    supplemental: {
      calculator: "📋 Máy Tính Chi Phí Bổ Sung",
      manageSupplementalCosts: "Quản Lý Chi Phí Bổ Sung",
      enterCostItemPlaceholder: "Nhập khoản chi phí (VD: Marketing, Đào tạo)",
      addCostItem: "Thêm Khoản Chi Phí",
      removeCostItem: "Xóa",
      totalAnnualSupplementalCosts: "Tổng Chi Phí Bổ Sung Hàng Năm:",
      pleaseEnterCostItem: "Vui lòng nhập tên khoản chi phí",
      monthlyFrequency: "Hàng Tháng",
      annualFrequency: "Hàng Năm",
      annualCost: "Chi Phí Hàng Năm"
    },
    
    // Operating Cost Calculator
    operating: {
      calculator: "🏢 Máy Tính Chi Phí Vận Hành",
      manageCostCategories: "Quản Lý Danh Mục Chi Phí",
      enterCostCategoryPlaceholder: "Nhập danh mục chi phí (VD: Phần mềm, Đào tạo)",
      addCategory: "Thêm Danh Mục",
      pleaseEnterCostCategory: "Vui lòng nhập tên danh mục chi phí",
      totalAnnualOperatingCosts: "Tổng Chi Phí Vận Hành Hàng Năm:"
    },
    
    // Revenue Stream Calculator
    revenue: {
      calculator: "💵 Máy Tính Nguồn Doanh Thu",
      revenueStreamsPricingStrategy: "Nguồn Doanh Thu & Chiến Lược Định Giá",
      manageServices: "Quản Lý Dịch Vụ",
      enterServiceNamePlaceholder: "Nhập tên dịch vụ (VD: French Manicure)",
      addService: "Thêm Dịch Vụ",
      pleaseEnterServiceName: "Vui lòng nhập tên dịch vụ",
      service: "Dịch Vụ",
      price: "Giá ($)",
      servicesPerWeek: "Dịch Vụ/Tuần",
      weeklyRevenue: "Doanh Thu Hàng Tuần ($)",
      estimatedAnnualRevenue: "Doanh Thu Hàng Năm Ước Tính:",
      comparePricesAdvice: "So sánh giá của bạn với mức giá trung bình địa phương và giá hòa vốn mỗi dịch vụ. Điều chỉnh khi cần thiết để có lợi nhuận và cạnh tranh.",
      totalWeeklyRevenue: "Tổng Doanh Thu Hàng Tuần:"
    },
    
    // Break Even Analysis
    analysis: {
      calculator: "⚖️ Máy Tính Phân Tích Hòa Vốn",
      calculatedFromBudgetToolData: "Tính Toán Từ Dữ Liệu Công Cụ Ngân Sách",
      autoCalculatedDescription: "Tất cả các giá trị dưới đây được tự động tính toán từ dữ liệu đã nhập trong các tab Nhân viên, Bổ sung, Vận hành và Doanh thu.",
  totalAnnualCosts: "Tổng Chi Phí Hàng Năm:",
  totalAnnualRevenue: "Tổng Doanh Thu Hàng Năm:",
      servicesPerWeek: "Dịch Vụ Mỗi Tuần:",
      averageServicePrice: "Giá Dịch Vụ Trung Bình:",
      employeeType: "Loại Nhân Viên:",
      notSet: "Chưa Đặt",
      
      // Section Titles
      resultsTitle: "Kết Quả Phân Tích Hòa Vốn",
      operationalEfficiencyTitle: "Phân Tích Hiệu Quả Hoạt Động",
      
      // Employee Model Information
      employeeModel: "Mô Hình Nhân Viên:",
      basicCalculation: "Tính Toán Cơ Bản:",
      basicCalculationDesc: "Lương theo giờ đơn giản với gánh nặng chủ lao động tiêu chuẩn",
      serviceBasedCalculation: "Tính Toán Dựa Trên Dịch Vụ:",
      serviceBasedCalculationDesc: "Phân tích chi phí tuyển dụng với các thông số dịch vụ",
      breakEvenModel: "Mô Hình Hòa Vốn:",
      breakEvenModelDesc: "Tính toán dựa trên hiệu quả hoạt động",
      comprehensiveModel: "Mô Hình Toàn Diện:",
      comprehensiveModelDesc: "Tính toán dựa trên hiệu quả hoạt động với đầy đủ thông số dịch vụ",
      
      // Labels for employee model details
      baseAnnualWage: "Lương Cơ Bản Hàng Năm:",
      employerBurden: "Gánh Nặng Chủ Lao Động (25%):",
      baseWage: "Lương Cơ Bản:",
      servicesPerShift: "Dịch Vụ Mỗi Ca:",
      pricePerService: "Giá Mỗi Dịch Vụ:",
      technicianShare: "Phần Của Kỹ Thuật Viên:",
      fica: "FICA (7.65%):",
      workersComp: "Bảo Hiểm Lao Động (2%):",
      additionalCosts: "Chi phí bổ sung (bảo hiểm, vật tư, thuê mặt bằng) bao gồm từ các tab Bổ sung/Vận hành",
      technicians: "Kỹ Thuật Viên:",
      hoursPerDay: "Giờ/Ngày:",
      daysPerMonth: "Ngày/Tháng:",
      appointmentsPerTechPerDay: "Lịch Hẹn/Kỹ Thuật Viên/Ngày:",
      wageModel: "Mô Hình Lương:",
      commissionRate: "Tỷ Lệ Hoa Hồng:",
      operationalParameters: "Thông Số Hoạt Động:",
      wageStructure: "Cơ Cấu Lương:",
      serviceParameters: "Thông Số Dịch Vụ:",
      additionalOverheadCosts: "Chi phí phụ trội bổ sung bao gồm từ các tab Chi Phí Bổ Sung và Vận Hành",
      
      // Results Section
      breakEvenAnalysisResults: "Kết Quả Phân Tích Hòa Vốn",
      breakEvenPricePerService: "Giá Hòa Vốn Mỗi Dịch Vụ:",
      currentAveragePrice: "Giá trung bình hiện tại:",
      aboveBreakEven: "Trên mức hòa vốn",
      belowBreakEven: "Dưới mức hòa vốn",
      annualRevenueNeeded: "Doanh Thu Hàng Năm Cần Thiết:",
      currentAnnualRevenue: "Doanh thu hàng năm hiện tại:",
      profitable: "Có Lợi Nhuận",
      operatingAtLoss: "Hoạt động thua lỗ",
      servicesPerYear: "Dịch Vụ Mỗi Năm:",
      basedOnServices: "Dựa trên {count} dịch vụ mỗi tuần × 52 tuần",
      adjustPricingAdvice: "Điều chỉnh giá cả hoặc khối lượng dịch vụ để đạt được lợi nhuận",
      totalAnnualCostsCovered: "Tổng chi phí hàng năm phải được bù đắp:",
      
      // Operational Efficiency Analysis  
      operationalEfficiencyAnalysis: "Phân Tích Hiệu Quả Hoạt Động",
      operationalMetrics: "Chỉ Số Hoạt Động",
      totalAvailableHoursMonth: "Tổng Giờ Có Sẵn/Tháng:",
      appointmentsMonth: "Lịch Hẹn/Tháng:",
      hoursBookedMonth: "Giờ Đã Đặt/Tháng:",
      utilizationRate: "Tỷ Lệ Sử Dụng:",
      financialPerformance: "Hiệu Suất Tài Chính",
      monthlyRevenue: "Doanh Thu Hàng Tháng:",
      monthlyCosts: "Chi Phí Hàng Tháng:",
      netProfit: "Lợi Nhuận Ròng:",
      netMargin: "Biên Lợi Nhuận Ròng:",
      breakEvenMetrics: "Chỉ Số Hòa Vốn",
      costPerAppointment: "Chi Phí Mỗi Lịch Hẹn:",
      avgServicePrice: "Giá Dịch Vụ Trung Bình:",
      contributionMargin: "Biên Đóng Góp:",
      breakEvenAppointments: "Lịch Hẹn Hòa Vốn:",
      performanceInsights: "Thông Tin Hiệu Suất",
      
      // Performance insights messages
      lowUtilization: "Sử Dụng Thấp:",
      lowUtilizationAdvice: "Cân nhắc giảm số lượng kỹ thuật viên hoặc tăng cường marketing để đặt thêm lịch hẹn.",
      moderateUtilization: "Sử Dụng Vừa Phải:",
      moderateUtilizationAdvice: "Nền tảng tốt - tối ưu hóa lịch trình và giá cả để cải thiện lợi nhuận.",
      highUtilization: "Sử Dụng Cao:",
      highUtilizationAdvice: "Hiệu quả xuất sắc! Cân nhắc mở rộng năng lực hoặc định giá cao cấp.",
      operatingLoss: "Hoạt Động Thua Lỗ:",
      operatingLossAdvice: "Tăng giá mỗi dịch vụ hoặc giảm chi phí.",
      breakEvenOperation: "Hoạt Động Hòa Vốn:",
      breakEvenOperationAdvice: "Tập trung vào tối ưu hóa chi phí và dịch vụ cao cấp.",
      profitableOperation: "Hoạt Động Có Lợi Nhuận:",
      profitableOperationAdvice: "Hiệu suất mạnh! Cân nhắc tái đầu tư vào tăng trưởng hoặc cải thiện chất lượng."
    },
    
    // Legal Disclaimer
    legalDisclaimer: "⚖️ Tuyên Bố Pháp Lý Quan Trọng",
    budgetEstimates: "Ước Tính Ngân Sách:",
    budgetEstimatesText: "Tất cả các tính toán đều là ước tính cho mục đích lập kế hoạch. Chi phí và doanh thu thực tế có thể khác nhau dựa trên điều kiện thị trường, hiệu quả hoạt động và các quyết định kinh doanh.",
    dataAccuracy: "Độ Chính Xác Dữ Liệu:",
    dataAccuracyText: "Độ chính xác của các dự báo này phụ thuộc vào chất lượng và tính đầy đủ của dữ liệu đầu vào. Khuyến nghị xem xét và cập nhật thường xuyên.",
    professionalAdviceRequired: "Cần Tư Vấn Chuyên Gia:",
    professionalAdviceRequiredText: "Tham khảo ý kiến của các cố vấn tài chính, kế toán và tư vấn kinh doanh trước khi đưa ra các cam kết tài chính lớn hoặc quyết định kinh doanh."
  }
};

// Get translations for a specific language
export const getTranslations = (language) => {
  //console.log("language -> " + language);
  return language === 'vi' ? vi : en;
};

// Hook to use translations in components
export const useTranslations = (language) => {
  return React.useMemo(() => getTranslations(language), [language]);
};

// Export full translation objects for sample download (only once, at the end)
export { en, vi };
