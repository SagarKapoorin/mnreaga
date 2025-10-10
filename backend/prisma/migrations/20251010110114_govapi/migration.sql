-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPerformance" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "metrics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "District_stateCode_idx" ON "District"("stateCode");

-- CreateIndex
CREATE UNIQUE INDEX "District_stateCode_districtName_key" ON "District"("stateCode", "districtName");

-- CreateIndex
CREATE INDEX "MonthlyPerformance_districtId_year_month_idx" ON "MonthlyPerformance"("districtId", "year", "month");

-- CreateIndex
CREATE INDEX "MonthlyPerformance_year_month_idx" ON "MonthlyPerformance"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPerformance_districtId_year_month_key" ON "MonthlyPerformance"("districtId", "year", "month");

-- AddForeignKey
ALTER TABLE "MonthlyPerformance" ADD CONSTRAINT "MonthlyPerformance_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
