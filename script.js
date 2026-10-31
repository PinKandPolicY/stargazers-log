const statusMessage = document.querySelector("#status");
const repositoryList = document.querySelector("#repositories");

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    for (const repository of repositories) {
      if (
        typeof repository.full_name !== "string" ||
        typeof repository.url !== "string" ||
        typeof repository.description !== "string" ||
        typeof repository.starred_at !== "string"
      ) {
        throw new Error("Repository data contains an invalid entry.");
      }

      const item = document.createElement("li");
      item.className = "repository";

      const heading = document.createElement("h2");
      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = repository.full_name;
      heading.append(link);

      const description = document.createElement("p");
      description.textContent = repository.description;

      const date = document.createElement("time");
      date.dateTime = repository.starred_at;
      date.textContent = `Starred on ${repository.starred_at}`;

      item.append(heading, description, date);
      repositoryList.append(item);
    }

    statusMessage.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    statusMessage.textContent =
      "Unable to load starred repositories. Please try again later.";
  }
}

loadRepositories();
