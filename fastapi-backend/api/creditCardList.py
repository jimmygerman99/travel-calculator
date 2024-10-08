# creditCardList.py

from typing import List, Dict

# Function to fetch all available credit cards grouped by sections


def get_credit_card_list() -> List[Dict[str, List[str]]]:
    # You can eventually replace this with dynamic fetching (scraping, API calls)
    credit_cards = [
        {
            "section": "American Express",
            "cards": [
                "American Express Platinum",
                "American Express Gold",
                "American Express Green",
                "Hilton Honors American Express",
                "Delta SkyMiles American Express",
            ],
        },
        {
            "section": "Chase",
            "cards": [
                "Chase Sapphire Preferred",
                "Chase Sapphire Reserve",
                "Chase Freedom Unlimited",
                "Chase Freedom Flex",
                "United Explorer Card",
                "IHG Rewards Club Premier",
            ],
        },
        {
            "section": "Citi",
            "cards": [
                "Citi Premier",
                "Citi Prestige",
                "Citi Double Cash",
                "Citi AAdvantage Platinum Select",
            ],
        },
        {
            "section": "Capital One",
            "cards": [
                "Capital One Venture",
                "Capital One VentureOne",
                "Capital One Savor",
            ],
        },
        # Add more sections for other hotel and travel cards
    ]
    return credit_cards
