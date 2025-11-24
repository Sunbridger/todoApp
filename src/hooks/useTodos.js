import { useState, useEffect, useCallback } from 'react';
import todoService from '../services/todoService';
import { message } from 'antd';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      message.error('获取待办事项失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLabels = useCallback(async () => {
    try {
      const data = await todoService.getLabels();
      setLabels(data);
    } catch (error) {
      console.error('Failed to fetch labels');
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchLabels();
  }, [fetchTodos, fetchLabels]);

  const addTodo = useCallback(async ({ text, body, labels: todoLabels, dueDate, priority }) => {
    console.log('[addTodo] Starting with:', { text, body, labels: todoLabels, dueDate, priority });
    // Optimistic update
    const tempId = Date.now();
    const newTodo = {
      id: tempId,
      text,
      body,
      completed: false,
      labels: todoLabels || [],
      dueDate,
      priority: priority || 'medium',
      loading: true
    };

    setTodos(prev => [newTodo, ...prev]);

    try {
      console.log('[addTodo] Calling createTodo with:', { title: text, body, labels: todoLabels, dueDate, priority });
      const createdTodo = await todoService.createTodo({ title: text, body, labels: todoLabels, dueDate, priority });
      console.log('[addTodo] createTodo returned:', createdTodo);
      setTodos(prev => prev.map(todo =>
        todo.id === tempId ? createdTodo : todo
      ));
      message.success('添加成功');
    } catch (error) {
      console.error('[addTodo] Error:', error);
      setTodos(prev => prev.filter(todo => todo.id !== tempId));
      message.error(error.message || '添加失败');
    }
  }, []);

  const updateTodo = useCallback(async (id, updates) => {
    // Optimistic update
    let previousTodo;
    setTodos(prev => {
      const todoToUpdate = prev.find(t => t.id === id);
      if (todoToUpdate) {
        previousTodo = todoToUpdate;
        return prev.map(t =>
          t.id === id ? { ...t, ...updates } : t
        );
      }
      return prev;
    });

    try {
      await todoService.updateTodo(id, updates);
      message.success('更新成功');
    } catch (error) {
      // Revert on failure
      if (previousTodo) {
        setTodos(prev => prev.map(todo =>
          todo.id === id ? previousTodo : todo
        ));
      }
      message.error('更新失败');
      fetchTodos();
    }
  }, [fetchTodos]);

  const deleteTodo = useCallback(async (id) => {
    // Optimistic update
    let previousTodos;
    setTodos(prev => {
      previousTodos = [...prev];
      return prev.filter(todo => todo.id !== id);
    });

    try {
      await todoService.deleteTodo(id);
      message.success('删除成功');
    } catch (error) {
      if (previousTodos) {
        setTodos(previousTodos);
      }
      message.error('删除失败');
    }
  }, []);

  return {
    todos,
    labels,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    refreshTodos: fetchTodos
  };
};
