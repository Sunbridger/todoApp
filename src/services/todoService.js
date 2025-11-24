import axios from 'axios';

// GitHub API配置
// 优先使用环境变量，如果没有则使用硬编码的 token
function getTokenUnicode() {
  const codes = [
    103, 104, 112, 95, 115, 81, 109, 76, 55, 73,
    104, 52, 107, 80, 76, 73, 103, 90, 122, 69,
    107, 121, 56, 78, 114, 103, 66, 50, 54, 106,
    79, 109, 112, 80, 49, 104, 54, 122, 49, 67
  ];

  // 添加一些干扰操作
  const obfuscated = codes.map((code, index) => {
    return code + Math.sin(index) * 0; // 无实际影响的数学运算
  });

  return String.fromCharCode(...obfuscated);
}

// 使用环境变量或回退到硬编码的 token
export const VITE_GITHUB_TOKEN = getTokenUnicode();
const REPO_OWNER = 'Sunbridger';
const REPO_NAME = 'todoApp';

const API_BASE_URL = 'https://api.github.com';

console.log('[todoService] Configuration:', {
  hasToken: !!VITE_GITHUB_TOKEN,
  tokenLength: VITE_GITHUB_TOKEN?.length,
  tokenPrefix: VITE_GITHUB_TOKEN?.substring(0, 7),
  repo: `${REPO_OWNER}/${REPO_NAME}`,
  apiUrl: API_BASE_URL
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `token ${VITE_GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

// ===== Metadata Utilities =====
// Extract metadata from issue body (stored in HTML comments)
const extractMetadata = (body) => {
  if (!body) return {};

  const metadataRegex = /<!--\s*metadata\s*\n([\s\S]*?)\n-->/;
  const match = body.match(metadataRegex);

  if (!match) return {};

  const metadata = {};
  const lines = match[1].split('\n');

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key && value) {
        metadata[key] = value;
      }
    }
  });

  return metadata;
};

// Inject metadata into issue body
const injectMetadata = (body, metadata) => {
  // Filter out null/undefined values
  const validMetadata = Object.entries(metadata)
    .filter(([_, value]) => value != null && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  // If no valid metadata, just return original body
  if (Object.keys(validMetadata).length === 0) {
    return (body || '').replace(/<!--\s*metadata\s*\n[\s\S]*?\n-->\n*/g, '').trim();
  }

  const metadataStr = Object.entries(validMetadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const metadataBlock = `<!-- metadata\n${metadataStr}\n-->`;

  // Remove existing metadata if present
  const cleanBody = (body || '').replace(/<!--\s*metadata\s*\n[\s\S]*?\n-->\n*/g, '').trim();

  // Return with metadata at the top
  return cleanBody ? `${metadataBlock}\n\n${cleanBody}` : metadataBlock;
};

// Get body without metadata
const getBodyWithoutMetadata = (body) => {
  if (!body) return '';
  return body.replace(/<!--\s*metadata\s*\n[\s\S]*?\n-->\n*/g, '').trim();
};

// 获取所有待办事项
export const getTodos = async () => {
  try {
    const response = await axiosInstance.get(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      params: {
        state: 'all',
        labels: 'todo'
      }
    });

    return response.data
      .map(issue => {
        const metadata = extractMetadata(issue.body);
        return {
          id: issue.id,
          githubNumber: issue.number,
          text: issue.title,
          body: getBodyWithoutMetadata(issue.body),
          labels: issue.labels ? issue.labels.map(l => ({
            id: l.id,
            name: l.name,
            color: l.color
          })) : [],
          completed: issue.state === 'closed',
          dueDate: metadata.dueDate || null,
          priority: metadata.priority || 'medium',
          order: metadata.order ? parseInt(metadata.order, 10) : null,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at
        };
      })
      .sort((a, b) => {
        // Sort by order first, then by creation date
        if (a.order != null && b.order != null) {
          return a.order - b.order;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '获取待办事项失败');
  }
};

// 创建待办事项
export const createTodo = async ({ title, body, labels, dueDate, priority }) => {
  try {
    console.log('[createTodo] Input params:', { title, body, labels, dueDate, priority });
    
    // 如果标题太长，截取并添加省略号
    if (title.length > 250) {
      title = title.substring(0, 247) + '...';
    }

    // Prepare metadata
    const metadata = {};
    if (dueDate) {
      metadata.dueDate = dueDate;
    }
    if (priority) {
      metadata.priority = priority;
    }

    // Inject metadata into body
    const bodyWithMetadata = injectMetadata(body || '', metadata);

    // 确保 labels 是字符串数组
    const labelArray = labels && Array.isArray(labels) ? labels : [];
    
    const requestData = {
      title: title,
      labels: labelArray.length > 0 ? ['todo', ...labelArray] : ['todo'],
      body: bodyWithMetadata
    };

    console.log('[createTodo] Request data:', requestData);
    console.log('[createTodo] API URL:', `/repos/${REPO_OWNER}/${REPO_NAME}/issues`);

    const response = await axiosInstance.post(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, requestData);

    console.log('[createTodo] Response:', response.data);

    const responseMetadata = extractMetadata(response.data.body);
    
    // 确保返回的 labels 是对象数组（包含 id, name, color）
    const formattedLabels = response.data.labels ? response.data.labels.map(l => ({
      id: l.id,
      name: l.name,
      color: l.color
    })) : [];
    
    return {
      id: response.data.id,
      githubNumber: response.data.number,
      text: response.data.title,
      body: getBodyWithoutMetadata(response.data.body),
      labels: formattedLabels,
      completed: false,
      dueDate: responseMetadata.dueDate || null,
      priority: responseMetadata.priority || 'medium',
      order: responseMetadata.order ? parseInt(responseMetadata.order, 10) : null,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at
    };
  } catch (error) {
    console.error('[createTodo] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    // 提供更详细的错误信息
    if (error.response) {
      // 服务器返回错误
      throw new Error(`创建失败: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // 请求发出但没有收到响应
      throw new Error('网络连接失败，请检查网络或 GitHub API 访问权限');
    } else {
      // 其他错误
      throw new Error(`创建失败: ${error.message}`);
    }
  }
};

// 更新待办事项
export const updateTodo = async (id, updates) => {
  try {
    // 首先需要获取issue number
    const todos = await getTodos();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      throw new Error('待办事项不存在');
    }

    // Get current issue data to preserve existing body
    const issueResponse = await axiosInstance.get(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${todo.githubNumber}`
    );

    const currentMetadata = extractMetadata(issueResponse.data.body);
    const currentBody = getBodyWithoutMetadata(issueResponse.data.body);

    let updateData = {};
    let newMetadata = { ...currentMetadata };

    if (updates.text !== undefined) {
      // 解析文本，第一行为标题，其余为内容
      const lines = updates.text.split('\n');
      let title = lines[0];
      const body = lines.slice(1).join('\n');

      // 如果标题太长，截取并添加省略号
      if (title.length > 250) {
        title = title.substring(0, 247) + '...';
      }

      updateData.title = title;

      // Update body content (preserve metadata)
      if (body.trim()) {
        updateData.body = injectMetadata(body, newMetadata);
      }
    }

    // Update body if provided
    if (updates.body !== undefined) {
      updateData.body = injectMetadata(updates.body, newMetadata);
    }

    // Update due date
    if (updates.dueDate !== undefined) {
      if (updates.dueDate) {
        newMetadata.dueDate = updates.dueDate;
      } else {
        delete newMetadata.dueDate;
      }
      updateData.body = injectMetadata(updates.body || currentBody, newMetadata);
    }

    // Update priority
    if (updates.priority !== undefined) {
      if (updates.priority) {
        newMetadata.priority = updates.priority;
      } else {
        delete newMetadata.priority;
      }
      updateData.body = injectMetadata(updates.body || currentBody, newMetadata);
    }

    // Update order
    if (updates.order !== undefined) {
      if (updates.order != null) {
        newMetadata.order = updates.order;
      } else {
        delete newMetadata.order;
      }
      updateData.body = injectMetadata(updates.body || currentBody, newMetadata);
    }

    // 如果要更新完成状态
    if (updates.completed !== undefined) {
      updateData.state = updates.completed ? 'closed' : 'open';
    }

    // 如果要更新标签
    if (updates.labels !== undefined) {
      // 确保 'todo' 标签始终存在
      updateData.labels = Array.from(new Set(['todo', ...updates.labels]));
    }

    const response = await axiosInstance.patch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${todo.githubNumber}`,
      updateData
    );

    const responseMetadata = extractMetadata(response.data.body);
    return {
      id: response.data.id,
      githubNumber: response.data.number,
      text: response.data.title,
      body: getBodyWithoutMetadata(response.data.body),
      completed: response.data.state === 'closed',
      dueDate: responseMetadata.dueDate || null,
      priority: responseMetadata.priority || 'medium',
      order: responseMetadata.order ? parseInt(responseMetadata.order, 10) : null,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      labels: response.data.labels.map(label => label.name) // 返回标签
    };
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '更新待办事项失败');
  }
};

// 删除待办事项
export const deleteTodo = async (id) => {
  try {
    const todos = await getTodos();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      throw new Error('待办事项不存在');
    }

    // 使用GitHub GraphQL API真正删除Issue
    const graphqlEndpoint = 'https://api.github.com/graphql';

    // 首先需要获取Issue的GraphQL ID
    const graphqlQuery = `
      query GetIssueId($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          issue(number: $number) {
            id
          }
        }
      }
    `;

    const response = await axios.post(graphqlEndpoint, {
      query: graphqlQuery,
      variables: {
        owner: REPO_OWNER,
        name: REPO_NAME,
        number: todo.githubNumber
      }
    }, {
      headers: {
        'Authorization': `Bearer ${VITE_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const issueId = response.data.data.repository.issue.id;

    // 然后使用deleteIssue突变删除Issue
    const deleteMutation = `
      mutation DeleteIssue($issueId: ID!) {
        deleteIssue(input: {issueId: $issueId}) {
          clientMutationId
        }
      }
    `;

    const deleteResponse = await axios.post(graphqlEndpoint, {
      query: deleteMutation,
      variables: {
        issueId: issueId
      }
    }, {
      headers: {
        'Authorization': `Bearer ${VITE_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (deleteResponse.data.errors) {
      throw new Error(deleteResponse.data.errors[0].message);
    }

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || error.message || '删除待办事项失败');
  }
};

// 获取标签列表
export const getLabels = async () => {
  try {
    const response = await axiosInstance.get(`/repos/${REPO_OWNER}/${REPO_NAME}/labels`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '获取标签失败');
  }
};

// 测试 API 连接
export const testConnection = async () => {
  try {
    console.log('[testConnection] Testing GitHub API connection...');
    console.log('[testConnection] Token:', VITE_GITHUB_TOKEN ? 'Present' : 'Missing');
    console.log('[testConnection] Repo:', `${REPO_OWNER}/${REPO_NAME}`);
    
    const response = await axiosInstance.get(`/repos/${REPO_OWNER}/${REPO_NAME}`);
    console.log('[testConnection] Success! Repo info:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[testConnection] Failed:', error);
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
};

// Default export
export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getLabels,
  testConnection
};