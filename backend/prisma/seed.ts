import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding districts for Uttar Pradesh...');
  const stateCode = 'UP';
  const stateName = 'Uttar Pradesh';
 const districts = [
  'Agra',
  'Aligarh',
  'Ambedkar Nagar',
  'Amethi',
  'Amroha',
  'Auraiya',
  'Ayodhya',
  'Azamgarh',
  'Badaun',
  'Baghpat',
  'Bahraich',
  'Ballia',
  'Balrampur',
  'Banda',
  'Barabanki',
  'Bareilly',
  'Basti',
  'Bhadohi',
  'Bijnor',
  'Budaun',
  'Bulandshahr',
  'Chandauli',
  'Chitrakoot',
  'Deoria',
  'Etah',
  'Etawah',
  'Ayodhya',
  'Farrukhabad',
  'Fatehpur',
  'Firozabad',
  'Gautam Buddha Nagar',
  'Ghaziabad',
  'Ghazipur',
  'Gonda',
  'Gorakhpur',
  'Hamirpur',
  'Hapur',
  'Hardoi',
  'Hathras',
  'Jalaun',
  'Jaunpur',
  'Jhansi',
  'Kannauj',
  'Kanpur Dehat',
  'Kanpur Nagar',
  'Kasganj',
  'Kaushambi',
  'Kushinagar',
  'Lakhimpur Kheri',
  'Lalitpur',
  'Lucknow',
  'Maharajganj',
  'Mahoba',
  'Mainpuri',
  'Mathura',
  'Mau',
  'Meerut',
  'Mirzapur',
  'Moradabad',
  'Muzaffarnagar',
  'Pilibhit',
  'Pratapgarh',
  'Prayagraj',
  'Raebareli',
  'Rampur',
  'Saharanpur',
  'Sambhal',
  'Sant Kabir Nagar',
  'Shahjahanpur',
  'Shamli',
  'Shravasti',
  'Siddharthnagar',
  'Sitapur',
  'Sonbhadra',
  'Sultanpur',
  'Unnao',
  'Varanasi'
];


  for (const districtName of districts) {
    await prisma.district.upsert({
      where: {
        stateCode_districtName: {
          stateCode,
          districtName,
        },
      },
      update: {},
      create: {
        stateCode,
        stateName,
        districtName,
      },
    });
  }

  console.log('Seeding complete.');

  // Seed sample monthly performance data for the past 12 months
  console.log('Seeding monthly performance data (last 12 months)...');
  // Fetch all districts for the state
  const seededDistricts = await prisma.district.findMany({ where: { stateCode }, select: { id: true, districtName: true } });
  const monthsToSeed = 12;
  const now = new Date();
  for (const district of seededDistricts) {
    for (let i = 0; i < monthsToSeed; i++) {
      // Calculate year and month for i months ago
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      // Generate sample metrics for all required fields
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const metrics = {
        Total_No_of_Active_Job_Cards: rand(5000, 20000),
        Total_No_of_JobCards_issued: rand(5000, 20000),
        Total_Households_Worked: rand(4000, 18000),
        Total_Individuals_Worked: rand(10000, 50000),
        Persondays_of_Central_Liability_so_far: rand(20000, 100000),
        Average_days_of_employment_provided_per_Household: rand(10, 100),
        Total_Exp: rand(50, 200),
        Wages: rand(30, 150),
        Material_and_skilled_Wages: rand(10, 60),
        Number_of_Completed_Works: rand(100, 1000),
        Number_of_Ongoing_Works: rand(50, 800),
        SC_workers_against_active_workers: rand(500, 5000),
        ST_workers_against_active_workers: rand(300, 3000),
        Women_Persondays: rand(10000, 80000),
      };
      await prisma.monthlyPerformance.upsert({
        where: {
          districtId_year_month: { districtId: district.id, year, month }
        },
        update: { metrics },
        create: { districtId: district.id, year, month, metrics }
      });
    }
  }
  console.log('Monthly performance seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });