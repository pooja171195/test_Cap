const axios = require("axios");

const authToken = `Bearer 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`; // Settings -> Developer settings -> Personal access token. Give repo and user scopes.
const org = "masai-sdet"; // "org-account-name-abc"; // "masai-course"; // "org-account-name-abc"; // "org-display-name-abc"; // masai-course // org name should not be display name
const team = "Cohort-1"; // "team-abc"; // cohort-6
const templateRepo = "template-code"; // "template-abc"; // "code-submission"; // "template-abc"; // repository template to use

let slice1 = 0;
let slice2 = 50;
var repoNames = ["Biswadip_fw20_0013","Nandan_fw19_0928","jitender_fp05_400","Sudipta_fp05_400","Pritesh_fw19_1135","Amit_fw20-1111","Ajay_fw21_0389","Md_fw20_1381","Manisha_fw20_0124","Amar_fw21_1115","Devendra_fp06_215","Prabhat_fw20_1281","Kaushik_fp06_178","Hrithik_fw21_0600","Jaydip_fw21_1038","Ravi_fw20_0601","Mohd_fp05_261","Aditya_fw21_0571","Abhay_fw19_0918","Shubham_fw19_0757","Sukhmani_fw18_0196", "Vicky_fw19_0792","S_fp03_158","sanjay_fp05_383","Tushar_fp05_263","Subhendu_fw20_0038","Pratibhav_fp06_371"]

var userNames = ["amREDOX","nanksi","jitenderji1137","sudiptapramanik209","Pritesh0711","Amitaryan9906","Ajay-Singh-Dhakad","faizan8092","manishawadhe","1803amar","devendra684","desiignerASUS","Kaushik368","hrithik2712k","Jaydip97","RaviKantBadola","nadeemm763","fw210571","Abhay0123","shubhamverma94","Sukhmani-Kaur1","vicky-ops","ferozsheik786","Rafayal383","Tusharsangai","srock2580","pratibhavgupta"]

var failedAddMembersArray = [];
var failedCollaboratorsArray = [];
var urlsArray = [];

const addOrUpdateMembershipInOrg = async (username) => {
  try {
    const response = await axios({
      method: "put",
      url: `https://api.github.com/orgs/${org}/teams/${team}/memberships/${username}`,
      headers: {
        Authorization: authToken,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const addMembers = async () => {
  const status = await Promise.allSettled(
    userNames.map((username) => addOrUpdateMembershipInOrg(username))
  );
  // console.log("Status =>-----------------------------------------------------", status);

  for (let i = 0; i < status.length; i++) {
    // console.log("val", status[i].value.config.url.split("/").pop());

    if (status[i].value.isAxiosError) {
      // console.log("status--------", status[i]);
      failedAddMembersArray.push(status[i].value.config.url.split("/").pop());
    }
  }
};

const createUsingTemplate = async (repositoryName) => {
  try {
    const response = await axios({
      method: "post",
      url: `https://api.github.com/repos/${org}/${templateRepo}/generate`, // owner -> org
      headers: {
        Authorization: authToken,
        Accept: "application/vnd.github.baptiste-preview+json",
      },
      data: {
        name: `${repositoryName}`,
        owner: `${org}`, // owner -> org
        private: true,
      },
    });
    return response;
  } catch (error) {
    failedRepo.push(repositoryName);
    return error;
  }
};

const createRepositories = async () => {
  const status = await Promise.allSettled(
    repoNames.map((name) => createUsingTemplate(name))
  );
  // console.log("createRepositories status ==============================", status);
};

const addCollaborator = async (repo, username) => {
  try {
    const response = await axios({
      method: "put",
      url: `https://api.github.com/repos/${org}/${repo}/collaborators/${username}`, // owner -> org
      headers: {
        Authorization: authToken,
        Accept: "application/vnd.github.baptiste-preview+json",
      },
      data: {
        permission: "maintain",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const addCollaboratorsToRepositories = async () => {
  const status = await Promise.allSettled(
    userNames.map((name, i) => addCollaborator(repoNames[i], name))
  );
  // console.log("addCollaboratorsToRepositories ================================>", status);

  for (let i = 0; i < status.length; i++) {
    urlsArray.push(status[i].value.config.url);

    // console.log("val", status[i].value.config.url.split("/").pop());

    if (status[i].value.isAxiosError) {
      //   console.log("status--------", status[i]);
      failedCollaboratorsArray.push(
        status[i].value.config.url.split("/").pop()
      );
    }
  }
};

async function automate() {
  try {
    await addMembers();
    console.log("failedAddMembersArray");
    console.dir(failedAddMembersArray, { maxArrayLength: null });

    await createRepositories();

    await addCollaboratorsToRepositories();
    console.log("failedCollaboratorsArray");
    console.dir(failedCollaboratorsArray, { maxArrayLength: null });
    console.log("urlsArray");
    console.dir(urlsArray, { maxArrayLength: null });
  } catch (error) {
    console.log(error);
  }
}

console.log(automate());
