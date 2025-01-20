# Monzo API Project

### Problem
I'm a big fan of Monzo due to the amount of automation that can be done from within the app. However, I identified an issue with the configuration - there was no criteria to move money into specific pots based on the last Friday of the month, which is pay day for me and many others. This leaves me with the option to set it for the 1st of the month - meaning there can sometimes be up to a week during which the money remains in my account balance. 

### Solution
I have created an extension of Monzo's out of box features in the form of an automation mini app that interacts with the Monzo API and runs on the last Friday of the month and automatically sorts my money into the respective pots. This also supports Monzo's Joint accounts.

### Sharing and Usage
Please feel free to use this as a baseline to expand upon for any integrations you'd like to build out using the Monzo API.