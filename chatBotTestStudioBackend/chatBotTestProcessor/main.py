from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from fuzzywuzzy import fuzz
import pandas as pd

options=webdriver.ChromeOptions()
options.set_capability('javascriptEnabled', True)

driver = webdriver.Remote(
   command_executor='http://172.17.0.2:4444/wd/hub',
   options = options)

driver.get("https://smartone.vps.com.vn/Account/Login")
wait = WebDriverWait(driver, 30)
wait.until(EC.presence_of_element_located((By.ID, "chat-bot-fdm")))
print(f'GOT CHATBOT SHOW UP')

class element_finding(object):
    def __init__(self, locator):
        self.locator = locator

    def __call__(self, driver):
        elements = driver.find_elements(*self.locator)  # Finding the referenced element
        elements_length = len(elements)
        if elements:
            return elements, elements_length
        else:
            return False


class send_questions(object):

    def __init__(self, chat_box, send_button, question):
        self.question = question
        self.send_button = send_button
        self.chat_box = chat_box

    def __call__(self, driver):
        chat_box = driver.find_element(*self.chat_box)
        send_button = driver.find_element(*self.send_button)
        if chat_box and send_button:
            chat_box.send_keys(self.question)
            send_button.click()
            return True
        else:
            return False


def login():
    account_input = driver.find_element(By.CLASS_NAME, "login-upper")
    account_input.send_keys("619723")

    password_input = driver.find_element(By.NAME, "Password")
    password_input.send_keys("Fdm2021@@")

    submit = driver.find_element(By.ID, "btnLogin")
    submit.click()

    try:
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "menu_top_accmargin")))
    except Exception as e:
        print(e)
    finally:
        pass


def chatbot():
    chatbot_wigget = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "bubble-chat-icon")))
    chatbot_wigget.click()

    name_input = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "username-chatbot")))
    name_input.send_keys("Demo")

    number_input = driver.find_element(By.CLASS_NAME, "phone-chatbot")
    number_input.send_keys("0923456789")

    connect_action = driver.find_element(By.CLASS_NAME, "btn-action-connect")
    connect_action.click()

class element_count_changed(object):
    def __init__(self, answer, init_count):
        self.answer = answer
        self.init_count = init_count

    def __call__(self, driver):
        answer = driver.find_elements(*self.answer)
        if answer and len(answer) > self.init_count:
            start_index = len(answer) - self.init_count
            return answer[-start_index:]
        else:
            return False

def chatSpamer(input):
    df = pd.read_excel(input, sheet_name="Scenario")
    print(f"GOT SCENARIO WITH {len(df)} STEPS")

    element = driver.find_elements(By.CLASS_NAME, "mes-right")
    if not element:
        return [{
                "question": "",
                "code": 400,
                "result": "No welcome message has found!"
            }]

    results = []

    for _, row in df.iterrows():
        question = row["Human"]
        expect_answer = row["Bot"]

        print(f'HUMAN: {question}')

        # Counting answer elements
        answers_counter = wait.until(
            element_finding((By.CLASS_NAME, "mes-right"))
        )

        # Sending questions
        send_question = wait.until(
            send_questions((By.CLASS_NAME, "input-main"), (By.CLASS_NAME, "icons-send"), question)
        )
        if not send_question:
            results.append({
                "question": question,
                "code": 400,
                "result": "Sending questions fail"
            })
            break

        
        # Get the last answer from bot
        bot_answer = wait.until(
            element_count_changed((By.CLASS_NAME, "mes-right"), answers_counter[1])
        )
        if not bot_answer:
            results.append({
                "question": question,
                "code": 408,
                "result": "Bot didn't response or maybe the conversation has ended"
            })
            break

        # Checking score
        bot_answer_text = bot_answer[-1].text
        print(f'BOT: {bot_answer_text}')

        match_ratio = fuzz.partial_ratio(expect_answer, bot_answer_text)
        if match_ratio < 80:
            results.append({
                "question": question,
                "code": 408,
                "result": f"GOT: {bot_answer_text}\nEXPECTED:{expect_answer}",
                "accuracy": match_ratio
            })
        elif match_ratio < 100:
            results.append({
                "question": question,
                "code": 200,
                "result": f"GOT: {bot_answer_text}\nEXPECTED:{expect_answer}",
                "accuracy": match_ratio
            })
        else:
            results.append({
                "question": question,
                "code": 200,
                "accuracy": match_ratio
            })

    return results


if __name__ == '__main__':
    # login()
    chatbot()

    try:
        results = chatSpamer("flow_mtk.xlsx")
        df = pd.DataFrame(results)
        df.to_excel("flow_mtk_output.xlsx", index=False, encoding='utf-8-sig')
    finally:
        driver.quit()
