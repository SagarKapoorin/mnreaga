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
      // Generate sample metrics
      const metrics = {
        workCompleted: Math.floor(Math.random() * 4001) + 1000,
        wagesPaid: Math.floor(Math.random() * 40001) + 10000
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