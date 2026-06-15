def calculate_cpf_digit(cpf_partial):
    sum = 0
    for i, digit in enumerate(cpf_partial):
        sum += int(digit) * (len(cpf_partial) + 1 - i)
    remainder = sum % 11
    return 0 if remainder < 2 else 11 - remainder

cpf = "123123123"
d1 = calculate_cpf_digit(cpf)
d2 = calculate_cpf_digit(cpf + str(d1))
print(f"Valid digits for 123123123 are: {d1}{d2}")
