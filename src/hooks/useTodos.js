import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  getTodos,
  createTodo,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      message.error('获取待办事项失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (todoData) => {
    // 乐观更新：先在本地添加一个临时状态
    const tempId = Date.now();
    const tempTodo = {
      id: tempId,
      text: todoData.title,
      body: todoData.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemp: true, // 标记为临时数据
    };

    setTodos((prev) => [tempTodo, ...prev]);

    try {
      const newTodo = await createTodo({
        title: todoData.title,
        body: todoData.description,
      });

      // 请求成功，用真实数据替换临时数据
      setTodos((prev) =>
        prev.map((todo) => (todo.id === tempId ? newTodo : todo))
      );
      message.success('添加成功');
    } catch (error) {
      // 请求失败，移除临时数据
      setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
      message.error('添加失败: ' + error.message);
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    // 乐观更新：先保存旧状态，然后立即更新 UI
    let previousTodo;
    setTodos((prev) => {
      const todoToUpdate = prev.find((t) => t.id === id);
      if (todoToUpdate) {
        previousTodo = todoToUpdate;
        return prev.map((t) =>
          t.id === id ? { ...t, ...updates, text: updates.text || t.text, completed: updates.completed !== undefined ? updates.completed : t.completed } : t
        );
      }
      return prev;
    });

    try {
      const updatedTodo = await updateTodoService(id, updates);
      // 确保使用服务器返回的最新数据（虽然乐观更新已经更新了 UI，但服务器可能返回更多字段或格式化后的数据）
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      message.success('更新成功');
    } catch (error) {
      // 失败回滚
      if (previousTodo) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? previousTodo : todo))
        );
      }
      message.error('更新失败: ' + error.message);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    // 乐观更新：先保存旧状态，然后立即移除
    let previousTodo;
    let previousIndex;
    setTodos((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      if (index !== -1) {
        previousTodo = prev[index];
        previousIndex = index;
        const newTodos = [...prev];
        newTodos.splice(index, 1);
        return newTodos;
      }
      return prev;
    });

    try {
      await deleteTodoService(id);
      message.success('删除成功');
    } catch (error) {
      // 失败回滚
      if (previousTodo) {
        setTodos((prev) => {
          const newTodos = [...prev];
          newTodos.splice(previousIndex, 0, previousTodo);
          return newTodos;
        });
      }
      message.error('删除失败: ' + error.message);
    }
  }, []);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    refresh: fetchTodos,
  };
};
