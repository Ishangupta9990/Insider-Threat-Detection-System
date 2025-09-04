from popup import enroll_typing, save_profile

if __name__ == "__main__":
    samples = []
    for _ in range(3):
        print("Please type the sample...")
        samples.append(enroll_typing())
    save_profile(samples)
    print("Typing profile enrolled.")
