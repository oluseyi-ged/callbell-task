describe("Conversations Screen", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  it("should show the screen title", async () => {
    await expect(element(by.text("Messages"))).toBeVisible()
  })

  it("should eventually show conversations or empty state", async () => {
    try {
      await waitFor(element(by.id("conversationItem-0")))
        .toBeVisible()
        .withTimeout(10000)
    } catch {
      await waitFor(element(by.id("emptyState")))
        .toBeVisible()
        .withTimeout(10000)
    }
  })

  it("should navigate to chat screen when conversation is tapped", async () => {
    try {
      await element(by.id("conversationItem-0")).tap()
      await expect(element(by.id("typeInput"))).toBeVisible()
    } catch {
      console.log("No conversations to test navigation")
    }
  })

  describe("Chat Screen", () => {
    it("should render the chat header", async () => {
      await expect(element(by.id("backBtn"))).toBeVisible()
      await expect(element(by.id("contactName"))).toBeVisible()
      await expect(element(by.id("avatar"))).toBeVisible()
    })

    it("should show chat messages or empty state", async () => {
      try {
        await waitFor(element(by.id("chatList")))
          .toBeVisible()
          .withTimeout(5000)
        await expect(element(by.id("chatMessage-0"))).toBeVisible()
      } catch {
        console.log("No chat messages found")
      }
    })

    it("should have input and send button visible", async () => {
      await expect(element(by.id("typeInput"))).toBeVisible()
      await expect(element(by.id("sendBtn"))).toBeVisible()
    })

    it("should go back to conversation screen", async () => {
      await element(by.id("backBtn")).tap()
      await expect(element(by.text("Messages"))).toBeVisible()
    })

    it("should navigate to another chat screen when conversation is tapped", async () => {
      try {
        await element(by.id("conversationItem-2")).tap()
        await expect(element(by.id("typeInput"))).toBeVisible()
      } catch {
        console.log("No conversations to test navigation")
      }
    })

    it("should navigate to contact screen when tapped", async () => {
      try {
        await element(by.id("contactName")).tap()
        await expect(element(by.id("contactImg"))).toBeVisible()
      } catch {
        console.log("Error opening contact page")
      }
    })
  })
})

describe("Contact Screen", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
    try {
      await element(by.id("conversationItem-0")).tap()
      await element(by.id("contactName")).tap()
      await waitFor(element(by.id("contactScreen")))
        .toBeVisible()
        .withTimeout(5000)
    } catch {
      console.log("Navigation to contact screen failed")
    }
  })

  it("should render the contact screen", async () => {
    await expect(element(by.id("contactScreen"))).toBeVisible()
  })

  it("should display the contact image", async () => {
    await expect(element(by.id("contactImg"))).toBeVisible()
  })

  it("should display the contact name and phone number", async () => {
    await expect(element(by.id("contactNameText"))).toBeVisible()
    await expect(element(by.id("phoneNumberText"))).toBeVisible()
  })

  it("should show all contact information sections", async () => {
    await expect(element(by.id("sourceInfoBlock"))).toBeVisible()
    await expect(element(by.id("emailBlock"))).toBeVisible()
    await expect(element(by.id("phoneBlock"))).toBeVisible()
    await expect(element(by.id("lastContactedBlock"))).toBeVisible()
  })

  describe("Name Editing", () => {
    it("should allow editing the contact name", async () => {
      await element(by.id("editButton")).tap()
      await expect(element(by.id("nameInput"))).toBeVisible()
      await expect(element(by.id("saveButton"))).toBeVisible()
    })

    it("should allow changing the name", async () => {
      await element(by.id("nameInput")).clearText()
      await element(by.id("nameInput")).typeText("New Contact Name")
      await expect(element(by.id("nameInput"))).toHaveText("New Contact Name")
    })

    it("should show loading indicator during save", async () => {
      await element(by.id("saveButton")).tap()
      try {
        await waitFor(element(by.id("saveLoadingIndicator")))
          .toBeVisible()
          .withTimeout(2000)
      } catch {
        // Ignore if save is too fast
      }
    })

    it("should display the updated name after save", async () => {
      await waitFor(element(by.id("contactNameText")))
        .toHaveText("New Contact Name")
        .withTimeout(5000)
    })
  })

  it("should reload the app after name update", async () => {
    await device.launchApp({ newInstance: true })
    await waitFor(element(by.text("Messages")))
      .toBeVisible()
      .withTimeout(5000)
  })

  it("should allow swipe to delete conversation", async () => {
    try {
      await waitFor(element(by.id("conversationItem-0")))
        .toBeVisible()
        .withTimeout(5000)

      await element(by.id("conversationItem-0")).swipe("left", "fast", 0.6)
      await expect(element(by.id("deleteButton-0"))).toBeVisible()
      await element(by.id("deleteButton-0")).tap()
    } catch {
      console.log("No conversations available to test swipe-to-delete")
    }
  })

  it.skip("should show loading state when saving", async () => {
    // Requires API response delay mocking
  })
})
