#!/usr/bin/env python3
"""
Personal Finance Data Generator

This script generates 24 months of fake personal finance data based on the schema.json structure.
"""

import json
import random
from datetime import datetime, timedelta
from faker import Faker
import uuid
from collections import Counter

fake = Faker()
random.seed(42)  # For reproducibility

# Real and fictional vendors/products
REAL_VENDORS = [
    ("Amazon", "Online Shopping", "Shopping"),
    ("Target", "Retail Store", "Shopping"),
    ("Walmart", "Grocery Store", "Groceries"),
    ("Whole Foods", "Grocery Store", "Groceries"),
    ("Starbucks", "Coffee Shop", "Restaurants"),
    ("McDonald's", "Fast Food", "Restaurants"),
    ("Chipotle", "Restaurant", "Restaurants"),
    ("Shell", "Gas Station", "Gas"),
    ("Exxon", "Gas Station", "Gas"),
    ("Uber", "Ride Share", "Public Transit"),
    ("Lyft", "Ride Share", "Public Transit"),
    ("CVS Pharmacy", "Pharmacy", "Healthcare"),
    ("Walgreens", "Pharmacy", "Healthcare"),
    ("Home Depot", "Home Improvement", "Shopping"),
    ("Best Buy", "Electronics", "Shopping"),
]

FICTIONAL_VENDORS = [
    ("QuickMart", "Convenience Store", "Groceries"),
    ("City Diner", "Restaurant", "Restaurants"),
    ("TechZone", "Electronics Store", "Shopping"),
    ("Fashion Forward", "Clothing Store", "Shopping"),
    ("Green Grocers", "Grocery Store", "Groceries"),
    ("The Book Nook", "Bookstore", "Entertainment"),
    ("FitLife Gym", "Gym", "Personal Care"),
    ("Metro Transit", "Public Transit", "Public Transit"),
    ("Corner Cafe", "Coffee Shop", "Restaurants"),
    ("Pet Paradise", "Pet Store", "Shopping"),
]

ALL_VENDORS = REAL_VENDORS + FICTIONAL_VENDORS


def generate_accounts():
    """Generate financial accounts."""
    accounts = [
        {
            "id": str(uuid.uuid4()),
            "name": "Primary Checking",
            "type": "checking",
            "balance": random.uniform(2000, 10000),
            "currency": "USD",
            "institution": "Chase Bank",
            "last_updated": datetime.now().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Savings Account",
            "type": "savings",
            "balance": random.uniform(10000, 50000),
            "currency": "USD",
            "institution": "Chase Bank",
            "last_updated": datetime.now().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Credit Card",
            "type": "credit_card",
            "balance": random.uniform(-5000, -500),
            "credit_limit": random.choice([5000, 10000, 15000, 20000]),
            "currency": "USD",
            "institution": "Capital One",
            "last_updated": datetime.now().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Investment Account",
            "type": "investment",
            "balance": random.uniform(50000, 200000),
            "currency": "USD",
            "institution": "Fidelity",
            "last_updated": datetime.now().isoformat(),
        },
    ]
    return accounts


def generate_categories():
    """Generate expense and income categories."""
    expense_categories = [
        ("Housing", "expense", None, "🏠", "#FF6B6B"),
        ("Rent", "expense", "Housing", "🏘️", "#FF8787"),
        ("Utilities", "expense", "Housing", "💡", "#FFA3A3"),
        ("Food & Dining", "expense", None, "🍽️", "#4ECDC4"),
        ("Groceries", "expense", "Food & Dining", "🛒", "#6EDCD4"),
        ("Restaurants", "expense", "Food & Dining", "🍕", "#8EEDE4"),
        ("Transportation", "expense", None, "🚗", "#95E1D3"),
        ("Gas", "expense", "Transportation", "⛽", "#A5E9D9"),
        ("Public Transit", "expense", "Transportation", "🚇", "#B5F1DF"),
        ("Shopping", "expense", None, "🛍️", "#F38181"),
        ("Entertainment", "expense", None, "🎬", "#AA96DA"),
        ("Healthcare", "expense", None, "🏥", "#FCBAD3"),
        ("Bills & Utilities", "expense", None, "📄", "#FFD93D"),
        ("Personal Care", "expense", None, "💅", "#C7CEEA"),
        ("Education", "expense", None, "📚", "#FFB6C1"),
    ]

    income_categories = [
        ("Salary", "income", None, "💰", "#6BCB77"),
        ("Freelance", "income", None, "💼", "#7BDB87"),
        ("Investment Returns", "income", None, "📈", "#8BEB97"),
    ]

    categories = []
    category_map = {}

    for name, cat_type, parent, icon, color in expense_categories + income_categories:
        cat_id = str(uuid.uuid4())
        category_map[name] = cat_id
        categories.append(
            {
                "id": cat_id,
                "name": name,
                "type": cat_type,
                "parent": category_map.get(parent) if parent else None,
                "icon": icon,
                "color": color,
            }
        )

    return categories, category_map


def generate_recurring_transactions(accounts, category_map):
    """Generate recurring transactions like salary and rent."""
    checking_account = [a for a in accounts if a["type"] == "checking"][0]

    recurring = [
        {
            "id": str(uuid.uuid4()),
            "description": "Monthly Salary",
            "amount": random.uniform(5000, 8000),
            "category": category_map["Salary"],
            "account": checking_account["id"],
            "frequency": "monthly",
            "next_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "auto_pay": False,
        },
        {
            "id": str(uuid.uuid4()),
            "description": "Rent Payment",
            "amount": -random.uniform(1200, 2500),
            "category": category_map["Rent"],
            "account": checking_account["id"],
            "frequency": "monthly",
            "next_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "auto_pay": True,
        },
        {
            "id": str(uuid.uuid4()),
            "description": "Netflix Subscription",
            "amount": -15.99,
            "category": category_map["Entertainment"],
            "account": checking_account["id"],
            "frequency": "monthly",
            "next_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "auto_pay": True,
        },
        {
            "id": str(uuid.uuid4()),
            "description": "Spotify Premium",
            "amount": -9.99,
            "category": category_map["Entertainment"],
            "account": checking_account["id"],
            "frequency": "monthly",
            "next_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "auto_pay": True,
        },
        {
            "id": str(uuid.uuid4()),
            "description": "Gym Membership",
            "amount": -random.uniform(30, 80),
            "category": category_map["Personal Care"],
            "account": checking_account["id"],
            "frequency": "monthly",
            "next_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "auto_pay": True,
        },
    ]

    return recurring


def generate_transactions_for_month(
    year, month, accounts, categories, category_map, recurring_transactions
):
    """Generate transactions for a single month."""
    transactions = []

    # Determine number of transactions for this month (50-100)
    num_transactions = random.randint(50, 100)

    # Get days in month
    if month == 12:
        next_month = datetime(year + 1, 1, 1)
    else:
        next_month = datetime(year, month + 1, 1)

    days_in_month = (next_month - timedelta(days=1)).day

    # Add recurring transactions
    for recurring in recurring_transactions:
        if recurring["frequency"] == "monthly":
            # Add salary on 1st of month
            if "Salary" in recurring["description"]:
                date = datetime(year, month, 1).strftime("%Y-%m-%d")
                transactions.append(
                    {
                        "id": str(uuid.uuid4()),
                        "date": date,
                        "description": recurring["description"],
                        "amount": recurring["amount"],
                        "category": recurring["category"],
                        "account": recurring["account"],
                        "type": "credit",
                        "tags": ["recurring", "salary"],
                        "merchant": None,
                        "notes": "Automatic salary deposit",
                    }
                )
            # Add rent on 1st of month
            elif "Rent" in recurring["description"]:
                date = datetime(year, month, 1).strftime("%Y-%m-%d")
                transactions.append(
                    {
                        "id": str(uuid.uuid4()),
                        "date": date,
                        "description": recurring["description"],
                        "amount": recurring["amount"],
                        "category": recurring["category"],
                        "account": recurring["account"],
                        "type": "debit",
                        "tags": ["recurring", "rent"],
                        "merchant": {
                            "name": "Property Management Co",
                            "location": fake.city(),
                        },
                        "notes": "Monthly rent payment",
                    }
                )
            # Add subscriptions around mid-month
            else:
                date = datetime(year, month, random.randint(10, 20)).strftime(
                    "%Y-%m-%d"
                )
                transactions.append(
                    {
                        "id": str(uuid.uuid4()),
                        "date": date,
                        "description": recurring["description"],
                        "amount": recurring["amount"],
                        "category": recurring["category"],
                        "account": recurring["account"],
                        "type": "debit",
                        "tags": ["recurring", "subscription"],
                        "merchant": {
                            "name": recurring["description"].split()[0],
                            "location": None,
                        },
                        "notes": "Automatic subscription payment",
                    }
                )

    # Generate random transactions
    remaining_transactions = num_transactions - len(transactions)

    # Category spending patterns
    category_patterns = {
        "Groceries": (30, 150, 0.15),  # (min, max, probability)
        "Restaurants": (15, 80, 0.20),
        "Gas": (30, 60, 0.10),
        "Shopping": (20, 200, 0.15),
        "Entertainment": (10, 100, 0.10),
        "Healthcare": (20, 300, 0.05),
        "Bills & Utilities": (50, 200, 0.08),
        "Personal Care": (15, 100, 0.07),
        "Public Transit": (5, 50, 0.10),
    }

    for _ in range(remaining_transactions):
        # Random date in month
        day = random.randint(1, days_in_month)
        date = datetime(year, month, day).strftime("%Y-%m-%d")

        # Select category based on patterns
        rand = random.random()
        selected_category = None
        cumulative = 0

        for cat_name, (min_amt, max_amt, prob) in category_patterns.items():
            cumulative += prob
            if rand <= cumulative:
                selected_category = cat_name
                break

        if not selected_category:
            selected_category = random.choice(list(category_patterns.keys()))

        min_amt, max_amt, _ = category_patterns[selected_category]
        amount = -random.uniform(min_amt, max_amt)  # Negative for expenses

        # Select vendor
        matching_vendors = [v for v in ALL_VENDORS if v[2] == selected_category]
        if matching_vendors:
            vendor_name, vendor_type, _ = random.choice(matching_vendors)
        else:
            vendor_name = fake.company()
            vendor_type = "Store"

        # Select account (mostly checking, sometimes credit card)
        if random.random() < 0.3:
            account = [a for a in accounts if a["type"] == "credit_card"][0]
        else:
            account = [a for a in accounts if a["type"] == "checking"][0]

        # Generate description
        if selected_category == "Groceries":
            descriptions = [
                f"{vendor_name} - Groceries",
                f"{vendor_name} - Food Shopping",
                f"{vendor_name}",
            ]
        elif selected_category == "Restaurants":
            descriptions = [
                f"{vendor_name}",
                f"{vendor_name} - Dinner",
                f"{vendor_name} - Lunch",
            ]
        elif selected_category == "Gas":
            descriptions = [f"{vendor_name} - Gas", f"{vendor_name} - Fuel"]
        else:
            descriptions = [f"{vendor_name}", f"{vendor_name} - Purchase"]

        description = random.choice(descriptions)

        # Generate tags
        tags = [selected_category.lower().replace(" ", "_")]
        if random.random() < 0.3:
            tags.append(random.choice(["business", "personal", "family", "urgent"]))

        transactions.append(
            {
                "id": str(uuid.uuid4()),
                "date": date,
                "description": description,
                "amount": round(amount, 2),
                "category": category_map[selected_category],
                "account": account["id"],
                "type": "debit",
                "tags": tags,
                "merchant": {
                    "name": vendor_name,
                    "location": fake.city() if random.random() < 0.7 else None,
                },
                "notes": fake.sentence() if random.random() < 0.2 else None,
            }
        )

    # Sort by date
    transactions.sort(key=lambda x: x["date"])

    return transactions


def generate_budgets(category_map, transactions):
    """Generate budgets based on actual spending."""
    budgets = []

    # Calculate spending per category per month
    monthly_spending = {}

    for transaction in transactions:
        if transaction["amount"] < 0:  # Only expenses
            date = datetime.strptime(transaction["date"], "%Y-%m-%d")
            month_key = date.strftime("%Y-%m")

            if month_key not in monthly_spending:
                monthly_spending[month_key] = {}

            cat_id = transaction["category"]
            if cat_id not in monthly_spending[month_key]:
                monthly_spending[month_key][cat_id] = 0

            monthly_spending[month_key][cat_id] += abs(transaction["amount"])

    # Generate budgets for each month and category
    budget_categories = [
        "Groceries",
        "Restaurants",
        "Shopping",
        "Entertainment",
        "Transportation",
    ]

    for month_key in sorted(monthly_spending.keys()):
        for cat_name in budget_categories:
            if cat_name in category_map:
                cat_id = category_map[cat_name]
                spent = monthly_spending.get(month_key, {}).get(cat_id, 0)

                # Set budget limit (spent + some buffer)
                monthly_limit = spent * random.uniform(1.1, 1.5)
                remaining = monthly_limit - spent

                budgets.append(
                    {
                        "id": str(uuid.uuid4()),
                        "category": cat_id,
                        "monthly_limit": round(monthly_limit, 2),
                        "spent": round(spent, 2),
                        "remaining": round(remaining, 2),
                        "period": month_key,
                    }
                )

    return budgets


def generate_financial_goals():
    """Generate financial goals."""
    goals = [
        {
            "id": str(uuid.uuid4()),
            "name": "Emergency Fund",
            "target_amount": 10000,
            "current_amount": random.uniform(3000, 8000),
            "status": random.choice(
                ["in_progress", "in_progress", "in_progress", "completed"]
            ),
            "deadline": (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d"),
            "monthly_contribution": random.uniform(200, 500),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Vacation Fund",
            "target_amount": random.uniform(3000, 5000),
            "current_amount": random.uniform(500, 2000),
            "status": "in_progress",
            "deadline": (datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d"),
            "monthly_contribution": random.uniform(200, 400),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "New Car Down Payment",
            "target_amount": random.uniform(5000, 10000),
            "current_amount": random.uniform(1000, 4000),
            "status": "in_progress",
            "deadline": (datetime.now() + timedelta(days=730)).strftime("%Y-%m-%d"),
            "monthly_contribution": random.uniform(300, 600),
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Home Down Payment",
            "target_amount": random.uniform(50000, 100000),
            "current_amount": random.uniform(10000, 30000),
            "status": "in_progress",
            "deadline": (datetime.now() + timedelta(days=1825)).strftime("%Y-%m-%d"),
            "monthly_contribution": random.uniform(1000, 2000),
        },
    ]

    return goals


def validate_transaction(txn):
    """Validate that a transaction has all required fields."""
    required = ["id", "date", "description", "amount", "category", "account", "type"]
    return all(field in txn for field in required)


def main():
    """Main function to generate all finance data."""
    print("Personal Finance Data Generator")
    print("=" * 50)

    # Load schema for reference
    try:
        with open("schema.json", "r") as f:
            schema = json.load(f)
        print("✓ Schema loaded successfully")
    except FileNotFoundError:
        print("⚠ Warning: schema.json not found, continuing without validation")
        schema = None

    # Generate accounts
    print("\nGenerating accounts...")
    accounts = generate_accounts()
    print(f"✓ Generated {len(accounts)} accounts")

    # Generate categories
    print("\nGenerating categories...")
    categories, category_map = generate_categories()
    print(f"✓ Generated {len(categories)} categories")

    # Generate recurring transactions
    print("\nGenerating recurring transactions...")
    recurring_transactions = generate_recurring_transactions(accounts, category_map)
    print(f"✓ Generated {len(recurring_transactions)} recurring transactions")

    # Generate transactions for 24 months
    print("\nGenerating transactions for 24 months...")
    start_date = datetime.now() - timedelta(days=730)
    all_transactions = []

    for month_offset in range(24):
        target_date = start_date + timedelta(days=30 * month_offset)
        year = target_date.year
        month = target_date.month

        month_transactions = generate_transactions_for_month(
            year, month, accounts, categories, category_map, recurring_transactions
        )
        all_transactions.extend(month_transactions)
        print(
            f"  ✓ Generated {len(month_transactions)} transactions for {year}-{month:02d}"
        )

    print(f"\n✓ Total transactions: {len(all_transactions)}")

    # Generate budgets
    print("\nGenerating budgets...")
    budgets = generate_budgets(category_map, all_transactions)
    print(f"✓ Generated {len(budgets)} budget entries")

    # Generate financial goals
    print("\nGenerating financial goals...")
    financial_goals = generate_financial_goals()
    print(f"✓ Generated {len(financial_goals)} financial goals")

    # Combine all data
    print("\nCombining data...")
    output_data = {
        "transactions": all_transactions,
        "accounts": accounts,
        "budgets": budgets,
        "categories": categories,
        "recurring_transactions": recurring_transactions,
        "financial_goals": financial_goals,
    }

    # Save to JSON file
    output_filename = "generated_finance_data.json"
    with open(output_filename, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\n✓ Data saved to {output_filename}")

    # Validation
    print("\nValidating data...")
    invalid = [t for t in all_transactions if not validate_transaction(t)]
    if invalid:
        print(f"⚠ Warning: {len(invalid)} invalid transactions found")
    else:
        print("✓ All transactions are valid")

    # Check date range
    dates = [t["date"] for t in all_transactions]
    print(f"✓ Date range: {min(dates)} to {max(dates)}")

    # Check transaction counts per month
    month_counts = Counter([t["date"][:7] for t in all_transactions])
    print(f"\n✓ Transactions per month:")
    for month in sorted(month_counts.keys()):
        count = month_counts[month]
        print(f"    {month}: {count} transactions")
        if count < 50 or count > 100:
            print(f"      ⚠ Warning: Expected 50-100 transactions, got {count}")

    # Summary
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"  Transactions: {len(all_transactions)}")
    print(f"  Accounts: {len(accounts)}")
    print(f"  Budgets: {len(budgets)}")
    print(f"  Categories: {len(categories)}")
    print(f"  Recurring Transactions: {len(recurring_transactions)}")
    print(f"  Financial Goals: {len(financial_goals)}")
    print("\n✓ Data generation complete!")


if __name__ == "__main__":
    main()
