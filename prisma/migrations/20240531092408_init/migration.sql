-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "bid_amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "current_price" SET DEFAULT '0',
ALTER COLUMN "current_price" SET DATA TYPE TEXT,
ALTER COLUMN "starting_price" SET DATA TYPE TEXT;
